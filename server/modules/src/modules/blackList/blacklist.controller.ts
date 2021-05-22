import { Controller, Get, UsePipes, Post, Body, Headers, Query, Delete, Put } from '@nestjs/common';
import {AuthStrategy} from 'src/auth/auth.decorator';
import {BlacklistService} from './blacklist.service';
import {ValidateToEmptyPipe} from 'src/pipe/validateToEmptyPipe.pipe';
import {AuthService} from 'src/auth/auth.service';
import { getTokenToString } from 'src/core/lib';

@Controller('blacklist')
export class BlacklistController {
  constructor(
    private readonly blacklistService: BlacklistService,
    private readonly authService: AuthService,
  ) {}

  /**
   * @desc black list
   * */
  @AuthStrategy()
  @Get()
  protected getBlacklist(@Query() query) {
    return this.blacklistService.getBlacklist(query);
  }

  /**
   * @desc create black list
   * */
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe([ 'ip', 'exp' ]))
  @Post('store')
  protected async createBlacklist(@Body() data, @Headers('authorization') authorization) {
    const { user } = await this.authService.validate(getTokenToString(authorization));
    return this.blacklistService.createBlacklist(data, user);
  }

  /**
   * @desc change black list time
   * */
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe(['exp', 'id']))
  @Put()
  protected async changeBlacklistTime (@Body() body, @Headers('authorization') authorization) {
    const { user } = await this.authService.validate(getTokenToString(authorization));
    return this.blacklistService.changeBlacklistTime(body, user);
  }

  /**
   * @desc delete black list
   * */
  @AuthStrategy()
  @Delete()
  protected async deleteBlacklist (@Body('id') id, @Headers('authorization') authorization) {
    const { user } = await this.authService.validate(getTokenToString(authorization));
    return this.blacklistService.deleteBlacklist(id, user);
  }

  /**
   * @desc blacklist status
   * */
  @AuthStrategy()
  @Get('status')
  protected getBlacklistStatus () {
    return this.blacklistService.getBlacklistStatus();
  }

  /**
   * @desc change the blacklist to open and close the state
   * */
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe(['status']))
  @Post('status')
  protected changeBlacklistStatus (@Body() body) {
    return this.blacklistService.changeBlacklistStatus(body);
  }
}
