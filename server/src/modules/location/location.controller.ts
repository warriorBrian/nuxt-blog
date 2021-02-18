import {Controller, Get, Query, Post, Body, UseInterceptors} from '@nestjs/common';
import {LocationService} from './location.service';
import {AuthStrategy} from 'src/auth/auth.decorator';

import { RateLimit, RateLimiterInterceptor } from 'nestjs-rate-limiter';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}
  /**
   * 获取位置信息, 查询IP地址信息
   * */
  @RateLimit({points: 60, duration: 60})
  @UseInterceptors(RateLimiterInterceptor)
  @Get()
  getLocation (@Query() query) {
    return this.locationService.getLocation(query.ip);
  }
  /**
   * 获取webservice key
   * */
  @AuthStrategy()
  @Get('keys')
  getWebServiceKeys () {
    return this.locationService.getWebServiceKeys();
  }
  /**
   * 获取统计信息
   * */
  @AuthStrategy()
  @RateLimit({points: 60, duration: 60})
  @UseInterceptors(RateLimiterInterceptor)
  @Get('limit')
  getLimit () {
    return this.locationService.getLimit();
  }
  /**
   * 保存/编辑 webservice key
   * @param body {object} key
   * */
  @AuthStrategy()
  @Post('store')
  storeServiceKeys (@Body() body) {
    return this.locationService.storeServiceKeys(body);
  }

  @Get('test')
  test (@Query() query) {
    return this.locationService.test(query);
  }
}
