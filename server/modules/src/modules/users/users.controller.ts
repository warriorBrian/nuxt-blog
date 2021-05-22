import {Controller, Get, Query, Post, Body, Delete, Put} from '@nestjs/common';
import {AuthStrategy} from 'src/auth/auth.decorator';
import {UsersService} from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @AuthStrategy()
  @Get('list')
  protected getUserList (@Query() query) {
    return this.usersService.getUserList(query);
  }

  @AuthStrategy()
  @Post('create')
  protected createUser (@Body() body) {
    return this.usersService.createUser(body);
  }

  @AuthStrategy()
  @Delete('delete')
  protected deleteUser (@Body('id') id: number & number[]) {
    return this.usersService.deleteUser(id);
  }

  @AuthStrategy()
  @Put('change-pwd')
  protected modifyUser (@Body() body) {
    return this.usersService.changePwd(body);
  }

}
