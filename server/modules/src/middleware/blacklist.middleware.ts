import {Injectable, NestMiddleware, ForbiddenException} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';

import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BlacklistEntity} from 'src/entity/blacklist.entity';
import {OptionsEntity} from 'src/entity/options.entity';

import {LocationService} from 'src/modules/location/location.service';

@Injectable()
export class BlacklistMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(BlacklistEntity) private readonly blackRepository: Repository<BlacklistEntity>,
    @InjectRepository(OptionsEntity) private readonly optionRepository: Repository<OptionsEntity>
  ) {}

  private async deleteBlackList (id) {
    await this.blackRepository.delete({id});
  }

  private async updateBlackListCount (ip, count) {
    await this.blackRepository.update({ip}, {count});
  }

  async use(request: Request, response: Response, next: NextFunction) {
    const { value } = await this.optionRepository.findOne({key: 'blacklist_status'});
    if (!Boolean(JSON.parse(value))) {
      // 黑名单关闭
      next();
      return false;
    }
    const nowTime = Number(Math.round(new Date().getTime()/1000));
    // 通过前端来传递访问ip
    const ip: any = request.headers['ip'];
    if (ip) {
      const blacklist = await this.blackRepository.findOne({ip});
      if (blacklist) {
        // 时间过期则删除，否则更新次数
        if (nowTime > blacklist.exp) {
          this.deleteBlackList(blacklist.id)
        } else {
          this.updateBlackListCount(ip, blacklist.count + 1);
          throw new ForbiddenException('访问被拒绝');
        }
      }
    }
    next();
  }
}
