import {Injectable, BadRequestException, ForbiddenException} from '@nestjs/common';

// typeorm
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BlacklistEntity} from 'src/entity/blacklist.entity';
import {UsersEntity} from 'src/entity/users.entity';
import {OptionsEntity} from 'src/entity/options.entity';

import {LocationService} from 'src/modules/location/location.service';
import {validateFormat, paging, toInteger} from 'src/core/lib';
import {plainToClass} from 'class-transformer';

import { MESSAGES } from 'src/core/enums/message.enum';
import { ArticleEntity } from '../../entity/article.entity';

@Injectable()
export class BlacklistService {
  constructor(
    @InjectRepository(BlacklistEntity) private readonly blacklistRepository: Repository<BlacklistEntity>,
    @InjectRepository(OptionsEntity) private readonly optionsRepository: Repository<OptionsEntity>,
    private readonly locationService: LocationService
  ) {}

  /**
   * @desc 黑名单列表
   * */
  public async getBlacklist (query) {
    const { page, pageSize } = paging(query.page, query.pageSize);
    const [data, count] = await this.blacklistRepository.createQueryBuilder('blacklist')
      .select(['blacklist.id', 'blacklist.ip', 'blacklist.address', 'blacklist.exp', 'blacklist.createdAt', 'blacklist.updatedAt', 'blacklist.count', 'user.username'])
      .leftJoin('blacklist.user', 'user', 'blacklist.user_id = user.id')
      .offset(page).limit(pageSize)
      .getManyAndCount();
    return {list: data, count};
  }

  /**
   * @desc 获取ip地址
   * @private
   * */
  private async getIpToAddress (ip: string) {
    const { detail_location: { result: { address } } } = await this.locationService.getLocation(ip);
    return address;
  }

  /**
   * @desc 创建黑名单
   * */
  public async createBlacklist (data, user: UsersEntity) {
    const { ip, exp } = data;
    const isIpv4 = validateFormat(ip, [ 'ipv4' ]);
    const address = isIpv4 ? await this.getIpToAddress(ip) : 'ip段不解析地址';
    const findDuplicationIp = await this.blacklistRepository.findOne({ip});
    if (findDuplicationIp) {
      // find duplication
      throw new BadRequestException(MESSAGES.IP_ALREADY_EXISTS_ERROR);
    }

    if (!validateFormat(ip, [ 'ipv4', 'ipv6', 'ipv4segment', 'ipv6segment' ] )) {
      throw new BadRequestException('ip地址不合法');
    }
    const value = plainToClass(BlacklistEntity, { ip, address, exp, user });
    const { raw: { affectedRows } } = await this.blacklistRepository.createQueryBuilder('blacklist')
      .insert()
      .into(BlacklistEntity)
      .values(value)
      .execute();
    return {message: `成功创建${affectedRows}条`};
  }


  public async changeBlacklistTime (data, user) {
    const value = plainToClass(ArticleEntity, {exp: data.exp});
    // 查找所属用户，提示给前台
    const belongsUser = await this.blacklistRepository.createQueryBuilder('blacklist')
      .select(['blacklist.id', 'user.username'])
      .where('blacklist.id = :id', {id: data.id})
      .leftJoin('blacklist.user', 'user')
      .getOne();

    if (!belongsUser) {
      throw new BadRequestException('无法查询关联用户数据');
    }
    if (belongsUser.user.username !== user.username) {
      throw new ForbiddenException(`无法删除${belongsUser.user.username}用户黑名单`);
    }
    // 修改过期时间
    await this.blacklistRepository.createQueryBuilder('blacklist')
      .update()
      .set(value)
      .where('blacklist.id = :blacklistId', {blacklistId: data.id})
      .andWhere('blacklist.user_id = :userId', {userId: user.id})
      .execute();
    return { message: '修改成功' };
  }

  /**
   * @desc 删除黑名单
   * */
  public async deleteBlacklist (id, user) {
    const coverValue = Array.isArray(id) ? id : Array.of(id);
    const {raw: { affectedRows } } = await this.blacklistRepository.createQueryBuilder('blacklist')
      .delete()
      .where('blacklist.id IN (:...id)', {id: coverValue})
      .andWhere('blacklist.user_id = :userId', {userId: user.id})
      .execute();
    return {message: `成功删除${affectedRows}条`};
  }

  /**
   * options table update,
   * options table find
   * */
  private async options_update (key: string, value: any) {
    return await this.optionsRepository.update({key}, {key, value: JSON.stringify(value) });
  }
  private async options_find (key_str) {
    const { id, key, value } = await this.optionsRepository.findOne({ key: key_str });
    return { id, key, value: JSON.parse(value) };
  }

  /**
   * @desc 获取黑名单开启关闭状态
   * */
  public async getBlacklistStatus () {
    const { value } = await this.options_find('blacklist_status');
    return {status: value};
  }

  /**
   * @desc 黑名单开启关闭
   * */
  public async changeBlacklistStatus (data) {
    await this.options_update('blacklist_status', toInteger(data.status));
    return {message: '更新成功'};
  }

}
