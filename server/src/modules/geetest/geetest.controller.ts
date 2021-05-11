import {Controller, Get, Post, Body, UsePipes} from '@nestjs/common';
import {GeetestService} from './geetest.service';
import {AuthStrategy} from 'src/auth/auth.decorator';
import {ValidateToEmptyPipe} from 'src/pipe/validateToEmptyPipe.pipe';

@Controller('geetest')
export class GeetestController {
  constructor(
    private readonly geetestService: GeetestService
  ) {}

  /**
   * @desc 获取极验key
   * */
  @AuthStrategy()
  @Get()
  getGeetestOptions () {
    return this.geetestService.getGeetestOptions();
  }

  /**
   * @desc 获取极验验证码
   * @desc not auth
   * */
  @Get('options')
  getCaptchaOptions () {
    return this.geetestService.getCaptchaOptions();
  }

  /**
   * @desc 更新极验key
   * */
  @Post()
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe([ 'geetest_id', 'geetest_key' ]))
  updateCaptchaOptions (@Body() body) {
    return this.geetestService.updateCaptchaOptions(body)
  }

}
