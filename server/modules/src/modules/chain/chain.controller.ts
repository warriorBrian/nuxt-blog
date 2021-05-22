import {Controller, Get, Post, Query, Body, UsePipes, Delete, UseInterceptors} from '@nestjs/common';
import {ChainService} from './chain.service';
import {AuthStrategy} from 'src/auth/auth.decorator';
import { ValidateToEmptyPipe } from 'src/pipe/validateToEmptyPipe.pipe';
import { RateLimit, RateLimiterInterceptor } from 'nestjs-rate-limiter';

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
  @RateLimit({ points: 1, duration: 60})
  @UseInterceptors(RateLimiterInterceptor)
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

  /**
   * @desc 获取友链提交开启关闭状态
   * */
  @Get('status')
  protected auditStatusHandle () {
    return this.chainService.auditStatusHandle();
  }

  /**
   * @desc 友链提交开启关闭
   * */
  @Post('status')
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe([ 'status' ]))
  protected auditChangeStatusHandle (@Body() body) {
    return this.chainService.auditChangeStatusHandle(body);
  }

}
