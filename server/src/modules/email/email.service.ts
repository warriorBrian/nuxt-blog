import { Injectable, BadRequestException } from '@nestjs/common';

import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {OptionsEntity} from 'src/entity/options.entity';

import { createTransport } from 'nodemailer';

interface SendEmailInterface {
  from: string;     // 发送者
  to: string;       // 推送地址
  subject: string;  // 主题
  html: string;     // 内容
}

@Injectable()
export class EmailService {
  constructor(
    @InjectRepository(OptionsEntity) private readonly optionsRepository: Repository<OptionsEntity>
  ) {}
  /**
   * @desc 获取email配置
   * @desc not auth
   * */
  public async getEmailConfig () {
    const { configs } = await this.getEmailConfigureHandle();
    const authPass = configs.auth.pass;
    // 对授权码进行脱敏
    const pass = authPass ? '*'.repeat(authPass.length) : '';
    return { configs: { ...configs, auth: { user: configs.auth.user, pass } } };
  }

  /**
   * @desc 获取email配置
   * */
  public async getEmailConfigureHandle () {
    const { value } = await this.optionsRepository.findOne({ key: 'email' });
    return { configs: value } as any;
  }

  /**
   * @desc 调用发送邮件
   * @desc public export methods
   * */
  public async sendEmail (config: SendEmailInterface) {
    const { configs } = await this.getEmailConfigureHandle();
    const isEmpty = Object.keys(configs).some(v => configs[v] == '');

    if (isEmpty) {
      throw new BadRequestException('邮箱配置为空');
    }
    const transport = await createTransport({ ...configs });
    return await transport.sendMail(config);
  }

  /**
   * @desc 配置邮箱
   * */
  public async setEmailConfigureHandle (body) {
    const emailConfig = await this.optionsRepository.findOne({key: 'email'});
    const data = Object.assign({}, emailConfig.value, body);
    await this.optionsRepository.update({key: 'email'}, { key: 'email', value: data });
    return { message: '修改成功' };
  }

  /**
   * @desc 发送测试邮件
   * */
  public async sendTestEmailHandle ({ from, to }) {
    const mailOptions = { from, to, subject: 'test', html: 'test' };
    const { response } = await this.sendEmail(mailOptions);
    return { message: response };
  }

}
