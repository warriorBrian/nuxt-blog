import {Injectable, BadRequestException} from '@nestjs/common';
import {generateSecret, totp} from 'speakeasy';
import {toDataURL} from 'qrcode';
import {toInteger, omitObjectEmpty} from 'src/core/lib';

// orm
import {InjectRepository} from '@nestjs/typeorm';
import {GoogleAuthEntity} from 'src/entity/googleAuth.entity';
import {OptionsEntity} from 'src/entity/options.entity';
import {Repository} from 'typeorm';


@Injectable()
export class GoogleAuthService {
  constructor(
    @InjectRepository(GoogleAuthEntity) private readonly googleAuthRepository: Repository<GoogleAuthEntity>,
    @InjectRepository(OptionsEntity) private readonly optionsRepository: Repository<OptionsEntity>
  ) {}
  public secret: string;
  public url: string;
  async getQrCode (update = false) {
    const findData = await this.googleAuthRepository.findOne();
    if (update) {
      return this.createAuthenticator(true, findData, findData.id);
    } else {
      return findData ? this.createAuthenticator(false, findData) : this.createAuthenticator();
    }
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
   * 获取验证器开关状态
   * */
  public async getAuthStatus () {
    const { value } = await this.options_find('auth_status');
    return {status: value};
  }
  /**
   * 更改验证器开关状态
   * */
  public async changeAuthStatus (status) {
    if (status == null) {
      throw new BadRequestException('验证器开关参数不能为空');
    }
    await this.options_update('auth_status', toInteger(status));
    return {message: '更新成功'};
  }
  /**
   * 校验谷歌验证码
   * */
  public async validateCode (code) {
    // 调用获取二维码保证secret始终赋值成功
    await this.getQrCode();
    // const token = totp({secret: this.secret, encoding: 'base32'});
    const data = totp.verify({secret: this.secret, encoding: 'base32', token: code});
    return {result: data};
  }
  /**
   * 创建谷歌验证器生成qrcode
   * */
  private async createAuthenticator (generate = true, data?: any, id?: number) {
    if (generate) {
      const generateSec = generateSecret({length: 20, name: 'blog qrcode'});
      // 如果id存在则更新，否则创建
      await this.googleAuthRepository.save(omitObjectEmpty({...generateSec, id}));
      this.secret = generateSec.base32;
      this.url = generateSec.otpauth_url;
    } else {
      this.url = data.otpauth_url;
      this.secret = data.base32;
    }
    return {code: await toDataURL(this.url)};
  }
}
