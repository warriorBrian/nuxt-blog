import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { AuthStrategy } from 'src/auth/auth.decorator';
import { EmailService } from './email.service';
import {ValidateToEmptyPipe} from 'src/pipe/validateToEmptyPipe.pipe';

@Controller('email')
export class EmailController {
  constructor(
    private readonly emailService: EmailService
  ) {}
  /**
   * @desc 获取email配置
   * */
  @Get()
  getEmailConfigureHandle () {
    return this.emailService.getEmailConfig();
  }

  /**
   * @desc 配置邮箱
   * */
  @Post()
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe([ 'host', 'port', 'secure', 'auth' ]))
  setEmailConfigureHandle (@Body() body) {
    return this.emailService.setEmailConfigureHandle(body);
  }

  /**
   * @desc 发送测试邮件
   * */
  @Post('test')
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe([ 'from', 'to' ]))
  sendTestEmailHandle (@Body() body) {
    return this.emailService.sendTestEmailHandle(body);
  }
}
