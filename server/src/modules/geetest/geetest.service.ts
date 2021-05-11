import {Injectable} from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Geetest = require('geetest');

import {InjectRepository} from '@nestjs/typeorm';
import {Repository, Connection} from 'typeorm';
import {OptionsEntity} from 'src/entity/options.entity';

@Injectable()
export class GeetestService {
  private captcha = '' as any;
  constructor(
    @InjectRepository(OptionsEntity) private readonly optionsRepository: Repository<OptionsEntity>,
    private connection: Connection,
  ) {}

  /**
   * @desc 获取极验key
   * */
  public async getGeetestOptions () {
    const list = await this.optionsRepository.createQueryBuilder('options')
      .select()
      .where('options.`key` IN (:...keys)', {keys: ['geetest_id', 'geetest_key']})
      .getMany();
    return list.reduce((acc, val) => (void(acc[val.key] = val.value) || acc), {}) as any;
  }

  /**
   * @desc 获取极验验证码
   * @desc not auth
   * */
  public async getCaptchaOptions () {
    const { geetest_id, geetest_key } = await this.getGeetestOptions();
    const captcha = new Geetest({
      geetest_id: geetest_id || 'xxx',
      geetest_key: geetest_key || 'xxx',
    });
    this.captcha = captcha;
    return await captcha.register();
  }

  /**
   * @desc 更新极验key
   * @param geetest_id {string} geetest id
   * @param geetest_key {string} geetest key
   * */
  public async updateCaptchaOptions ({ geetest_id, geetest_key }) {
    // update id
    await this.optionsRepository.update({key: 'geetest_id'}, { key: 'geetest_id', value: geetest_id });

    // update key
    await this.optionsRepository.update({key: 'geetest_key'}, { key: 'geetest_key', value: geetest_key });

  }

  public async validateCaptcha (body) {
    const data = Object.keys(body).reduce((acc, val) => {
      const idx = val.indexOf('_');
      const key = val.slice(idx + 1, val.length);
      acc[key] = body[val];
      return acc;
    }, {});
    await this.getCaptchaOptions();
    return await this.captcha.validate({ ...data });
  }

}
