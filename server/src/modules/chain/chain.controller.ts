import {Controller, Get, Post, Query, Body, UsePipes, Delete} from '@nestjs/common';
import {ChainService} from './chain.service';
import {AuthStrategy} from 'src/auth/auth.decorator';
import { ValidateToEmptyPipe } from 'src/pipe/validateToEmptyPipe.pipe';

@Controller('chain')
export class ChainController {
  constructor(
    private readonly chainService: ChainService
  ) {}

  /**
   * @desc 获取链接列表
   * @desc not auth
   * */
  @Get('list')
  protected getChainListHandle () {
    return this.chainService.getChainListHandle();
  }

  /**
   * @desc 获取链接列表
   * */
  @Get()
  @AuthStrategy()
  protected getChainLists (@Query() query) {
    return this.chainService.getChainLists(query);
  }

  /**
   * @desc 创建链接
   * */
  @Post()
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe([ 'name', 'link', 'avatarLink', 'email' ]))
  protected createChainHandle (@Body() body) {
    return this.chainService.createChainHandle(body);
  }

  /**
   * @desc 删除链接
   * */
  @Delete()
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe([ 'id' ]))
  protected deleteChainHandle (@Body() body) {
    return this.chainService.deleteChainHandle(body);
  }

  /**
   * @desc 审核链接
   * @param body { object } body.status 审核状态
   * @param body { object } body.suggest 审核建议
   * @param body { object } body.email 是否推送邮箱
   * */
  @Post('audit')
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe([ 'id', 'status', 'suggest', 'email', 'pushEmail' ]))
  protected auditChainHandle (@Body() body) {
    return this.chainService.auditChainHandle(body);
  }

}
