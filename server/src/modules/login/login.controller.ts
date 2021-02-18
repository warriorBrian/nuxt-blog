import {Controller, Post, Body} from '@nestjs/common';
import {LoginService} from './login.service';

@Controller('login')
export class LoginController {
  constructor(private  readonly loginService: LoginService) {}
  @Post()
  store (@Body() body) {
    return this.loginService.store(body);
  }
}
