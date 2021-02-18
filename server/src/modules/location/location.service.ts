import {Injectable, HttpService, BadRequestException} from '@nestjs/common';
import {isEmpty, omitObjectEmpty, defaultTo} from 'src/core/lib';

import {InjectRepository} from '@nestjs/typeorm';
import {Repository, Brackets} from 'typeorm';
import {OptionsEntity} from 'src/entity/options.entity';

@Injectable()
export class LocationService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(OptionsEntity) private readonly optionsRepository:Repository<OptionsEntity>
  ) {}
  private async getIpLocation (key: string, ip?: string) {
    // 获取IP地址信息
    const location = await this.httpService.get('https://apis.map.qq.com/ws/location/v1/ip', {params: {  key, ip }}).toPromise();
    if (location.data.status) {
      throw new BadRequestException(location.data.message);
    }
    return location;
  }
  private async getDetailLocation (key: string, location) {
    // 获取 IP地址详细信息
    const detail = await this.httpService.get('https://apis.map.qq.com/ws/geocoder/v1/', {params: { key, location, 'get_poi': 1 } }).toPromise();
    if (detail.data.status) {
      throw new BadRequestException(detail.data.message);
    }
    return detail;
  }
  /**
   * 获取地理位置信息
   * */
  public async getLocation (ip?: string) {
    // 查询字段
    const webservice_key = await this.options_find('webservice_key');
    // 查询IP归属地
    const queryIpLocation = await this.getIpLocation(webservice_key.value, ip);
    const queryIpLocationResult = queryIpLocation.data.result;
    const coverLocation = `${queryIpLocationResult.location.lat},${queryIpLocationResult.location.lng}`;
    // 查询详细经纬度地址信息
    const coordinatesLocation = await this.getDetailLocation(webservice_key.value, coverLocation);
    return {
      'query_ip_location': queryIpLocation.data,
      'detail_location': coordinatesLocation.data
    };
  }
  /**
   * 获取webservice 限制信息
   * */
  public async getLimit () {
    const webservice_key = await this.options_find('webservice_key');
    const queryIpLocation = await this.getIpLocation(webservice_key.value);
    const queryIpLocationResult = queryIpLocation.data.result;
    const coverLocation = `${queryIpLocationResult.location.lat},${queryIpLocationResult.location.lng}`;
    const { data: { result } } = await this.getDetailLocation(webservice_key.value, coverLocation);
    if (queryIpLocation.data.status !== 0) {
      return queryIpLocation.data;
    } else {
      const limit = queryIpLocation.headers['x-limit'];
      const handleData = limit.split(';').reduce((acc, val) => {
        const value = val.trim().split('=');
        acc[value[0]] = value[1];
        return acc;
      }, {});
      const mixinData = {...queryIpLocation.data.result, ad_info: result.ad_info};
      return {...mixinData, ...handleData};
    }
  }
  /**
   * options find
   * */
  async options_find (key, capture = true) {
    const optionsFindKey = await this.optionsRepository.findOne({key});
    if (!optionsFindKey && capture) {
      throw new BadRequestException('缺少必要字段key');
    }
    return optionsFindKey;
  }
  /**
   * 获取webservice key
   * */
  public async getWebServiceKeys () {
    // 不能直接将查询语句赋值给类属性，会存在缓存无法查询最新数据
    const webservice_key = await this.options_find('webservice_key');
    return !isEmpty(webservice_key) ? {key: webservice_key.value} : undefined;
  }

  /**
   * 修改/新增webservice key
   * */
  public async storeServiceKeys ({key: value}) {
    const findServiceKey = await this.options_find('webservice_key', false);
    const storeData = omitObjectEmpty({ key: 'webservice_key', value: value, id: findServiceKey ? findServiceKey.id : '' });
    if (isEmpty(value)) {
      throw new BadRequestException('参数不能为空');
    }
    await this.optionsRepository.save(storeData);
  }

  async test (query?: any) {
    const {page, pageSize} = query;
    const skipData = Number(pageSize) * (Number(page) - 1);
    const [data, count] = await this.optionsRepository
      .createQueryBuilder('user')
      .skip(skipData)
      .take(Number(pageSize))
      .getManyAndCount();

    const res = await this.optionsRepository.createQueryBuilder('options')
      .where('options.key LIKE :key', {key: `%${query.key}%`})
      .getSql();
    console.log(res, 'res');

    return {
      result: data,
      count
    }
  }

}
