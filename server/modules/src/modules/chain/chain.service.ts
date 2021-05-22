import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChainEntity } from 'src/entity/chain.entity';
import {plainToClass} from 'class-transformer';

import {EmailService} from 'src/modules/email/email.service';

@Injectable()
export class ChainService {
  constructor(
    @InjectRepository(ChainEntity) private readonly chainRepository: Repository<ChainEntity>,
    private readonly emailService: EmailService
  ) {}

  /**
   * @desc 获取链接列表
   * @desc not auth
   * */
  public async getChainListHandle () {
    const list = await this.chainRepository.createQueryBuilder('chain')
      .select(['chain.name', 'chain.link', 'chain.avatarLink'])
      .where('chain.status =:status', { status: 1 })
      .getMany();
    return { list };
  }

  /**
   * @desc 获取链接列表
   * */
  public async getChainLists (query) {
    const chainListHandle = await this.chainRepository.createQueryBuilder('chain')
      .select()
      .orderBy({"status": "ASC", "updatedAt": "DESC", "id": "DESC"});
    // 如果筛选条件存在则进行status筛选
    if (query.key) {
      const list = await chainListHandle.where('chain.status =:status', { status: query.key }).getMany();
      return { list };
    }
    const list = await chainListHandle.getMany();
    return { list };
  }

  /**
   * @desc 创建链接
   * */
  public async createChainHandle ({ name, link, avatarLink, email }) {
    const findDuplicate = await this.chainRepository.findOne({ name });
    if (findDuplicate) {
      throw new BadRequestException('此链接名称已经存在');
    }
    const value = plainToClass(ChainEntity, { name, link, avatarLink, email });
    const { raw: { affectedRows } } = await this.chainRepository.createQueryBuilder('chain')
      .insert()
      .values(value)
      .execute();
    return { message: `成功创建${affectedRows}条` };
  }

  /**
   * @desc 删除链接
   * */
  public async deleteChainHandle (body) {
    const coverValue = Array.isArray(body.id) ? body.id : Array.of(body.id);
    const { affected } = await this.chainRepository.createQueryBuilder('chain')
      .delete()
      .where('chain.id IN (:...id)', {id: coverValue})
      .andWhere('chain.status !=:status', { status: 0 })
      .execute();
    return { message: `成功删除${affected}条` };
  }

  /**
   * @desc 审核链接
   * */
  public async auditChainHandle ({ id, status, suggest, email, pushEmail }) {
    // 推送邮件开启
    if (pushEmail) {
      const statusMapping = {
        0: '待审核',
        1: '通过，您的友链将会展示，非常感谢您的支持!',
        2: '拒绝'
      };
      const styleMapping = { 0: '#ff9900', 1: '#45caad', 2: '#F1432C' };
      const auditStatus = `<b> 友链审核状态: </b> <span style="color:${ styleMapping[status] }"> ${statusMapping[status]} </span>  <span> ${status === 2 ? suggest : ''} </span>`;
      const { configs } = await this.emailService.getEmailConfigureHandle();
      if (!configs.auth) {
        throw new BadRequestException('邮箱配置不正确，无法完成推送');
      }
      const mailOptions = { from: configs.auth.user, to: email, subject: '友链审核状态', html: auditStatus };
      // 发送邮件
      try {
        await this.emailService.sendEmail(mailOptions);
      } catch (e) {
        throw new BadRequestException(e);
      }
    }
    const value = plainToClass(ChainEntity, { status, suggest });
    const { affected } = await this.chainRepository.createQueryBuilder('chain')
      .update()
      .set(value)
      .where('chain.id =:id', { id })
      .execute();
    return { message: `成功修改${affected}条` };
  }

}
