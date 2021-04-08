import {Injectable, BadRequestException, HttpService} from '@nestjs/common';
import {MESSAGES} from 'src/core/enums/message.enum';

import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {OptionsEntity} from 'src/entity/options.entity';

import * as qiniu from 'qiniu';

@Injectable()
export class UploadPicService {
  private uploadType = ['local', 'qiniu'];
  private uploadKeys = 'uploadPic_type';
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(OptionsEntity) private readonly optionsRepository: Repository<OptionsEntity>
  ) {}

  /**
   * options table update
   * */
  private async options_update (key: string, value: any) {
    const val = typeof value == 'string' ? value : JSON.stringify(value);
    return await this.optionsRepository.update({key}, {key, value: val });
  }

  /**
   * @desc 获取key/value
   * */
  private async getOptionsKey (keys: string[]) {
    const list = await this.optionsRepository.createQueryBuilder('options')
      .select()
      .where('options.`key` IN (:...keys)', {keys: keys})
      .getMany();
    return list.reduce((acc, val) => (void(acc[val.key] = val.value) || acc), {});
  }

  /**
   * @desc 获取图片存储方式
   * */
  async getUploadPicType () {
    const { value } = await this.optionsRepository.findOne({key: 'uploadPic_type'});
    return { type: value };
  }

  /**
   * @desc 修改图片存储方式
   * */
  async changeUploadPicType ({ type }) {
    if (!this.uploadType.includes(type)) {
      throw new BadRequestException(MESSAGES.NOT_SUPPORT_OTHER_METHOD);
    }
    await this.options_update(this.uploadKeys, type);
    return {message: '更新成功'};
  }

  /**
   * @desc 获取七牛云AK/SK
   * */
  async getQiniuSecretKey () {
    return this.getOptionsKey(['qiniu_accessKey', 'qiniu_secretKey', 'qiniu_bucket', 'qiniu_domain']);
  }

  /**
   * @desc 获取七牛云bucket列表
   * @type private
   * */
  private async getQiniuBucket (mac) {
    // 获取所有bucket
    const bucketRequestURI = 'http://rs.qbox.me/buckets';
    const bucketToken = qiniu.util.generateAccessToken(mac, bucketRequestURI);
    try {
      const { data } = await this.httpService.get(bucketRequestURI, { headers: { 'Authorization': bucketToken } }).toPromise();
      return {list: data};
    } catch (e) {
      throw new BadRequestException(e.response.data.error);
    }
  }

  /**
   * @desc 获取七牛云指定bucket中的domain
   * @desc 如果传入type: "domain"，必须传入scope指定空间
   * */
  private async getQiniuBucketBindDomain (mac, scope: string) {
    if (!scope) {
      throw new BadRequestException('获取指定空间绑定域名时scope不能为空');
    }
    // 获取指定空间下的域名地址
    const prefix = 'http://api.qiniu.com';
    const api = `${prefix}/v6/domain/list?tbl=${scope}`;
    const token = qiniu.util.generateAccessToken(mac, api);
    try {
      const { data } = await this.httpService.get(api, { headers: { 'Authorization': token } }).toPromise();
      return {list: data};
    } catch (e) {
      throw new BadRequestException(e.response.data.error);
    }
  }

  /**
   * @desc 获取七牛云bucket/domain
   * */
  async getQiniuService ({ak, sk, type, scope}) {
    const mac = await new qiniu.auth.digest.Mac(ak, sk);
    console.log(type, 'type');
    if (Object.is(type, 'bucket')) {
      return this.getQiniuBucket(mac);
    }
    if (Object.is(type, 'domain')) {
      return this.getQiniuBucketBindDomain(mac, scope);
    }
  }

  /**
   * @desc 更新七牛云配置
   * */
  async updateQiniuSecretKey (data) {
    /**
     * 最终拼接SQL结构为：
     UPDATE categories
     SET xxx = CASE id
     WHEN 1 THEN 3
     WHEN 2 THEN 4
     END
     WHERE id IN (1,2,3)
     * 暂不考虑使用循环批量更新数据
     * */
    const batchUpdateSql = Object.keys(data).reduce((acc, val, index) => {
      acc += `WHEN '${val}' THEN '${data[val]}'`;
      if (Object.keys(data).length - 1 === index) {
        const list = Object.keys(data).map(s => `'${s}'`).toString();
        acc += `END WHERE \`key\` IN (${list})`;
      }
      return acc;
    }, 'UPDATE `options` options SET options.`value` = CASE `key`');

    const { changedRows } = await this.optionsRepository.query(batchUpdateSql);

    return {message: `更新${changedRows}条数据`};
  }

}
