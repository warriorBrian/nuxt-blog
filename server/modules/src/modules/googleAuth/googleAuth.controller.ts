import {Controller, Get, Post, Body, Query} from '@nestjs/common';
import {AuthStrategy} from 'src/auth/auth.decorator';
import {GoogleAuthService} from './googleAuth.service';

@Controller('googleAuth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @AuthStrategy()
  @Get()
  getQrCode (@Query('update') update) {
    return this.googleAuthService.getQrCode(Boolean(Number(update)));
  }

  @Post('validate')
  validateCode (@Body() body) {
    return this.googleAuthService.validateCode(body.code);
  }

  @Get('status')
  getAuthStatus () {
    return this.googleAuthService.getAuthStatus();
  }

  @AuthStrategy()
  @Post('status')
  changeAuthStatus (@Body('status') status) {
    return this.googleAuthService.changeAuthStatus(status);
  }

}
