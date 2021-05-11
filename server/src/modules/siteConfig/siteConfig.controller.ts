import {Controller, Get, Post, Body, UsePipes, Query, Delete, Put, UploadedFile} from '@nestjs/common';
import {SiteConfigService} from './siteConfig.service';
import {AuthStrategy} from 'src/auth/auth.decorator';
import {ValidateToEmptyPipe} from 'src/pipe/validateToEmptyPipe.pipe';
import {UploadFile} from 'src/core/decorators/file.decorators';

@Controller('site-config')
export class SiteConfigController {
  constructor(
    private readonly siteConfigService: SiteConfigService
  ) {}

  /**
   * @desc 获取站点配置信息列表
   * @desc not auth
   * @return 返回树形结构数据
   * */
  @Get('list')
  protected getSiteConfigLists () {
    return this.siteConfigService.getSiteConfigLists();
  }

  /**
   * @desc 获取站点配置信息列表
   * */
  @AuthStrategy()
  @Get()
  protected getSiteConfigHandle (@Query() query) {
    return this.siteConfigService.getSiteConfigHandle(query);
  }

  /**
   * @desc 获取父级列表用于创建关联关系
   * */
  @AuthStrategy()
  @Get('relations')
  protected getSiteRelationsLists () {
    return this.siteConfigService.getSiteRelationsLists();
  }

  /**
   * @desc 创建站点信息
   * @desc not auth
   * */
  @AuthStrategy()
  @Post()
  @UsePipes(new ValidateToEmptyPipe(['title', 'type', 'desc', 'subDesc', 'banner', 'link']))
  protected createSiteConfigHandle (@Body() body) {
    return this.siteConfigService.createSiteConfigHandle(body);
  }

  /**
   * @desc 编辑站点信息
   * */
  @AuthStrategy()
  @Put()
  @UsePipes(new ValidateToEmptyPipe(['id', 'title', 'type', 'desc', 'subDesc', 'banner', 'link', 'parentId']))
  protected editSiteConfigHandle (@Body() body) {
    return this.siteConfigService.editSiteConfigHandle(body);
  }

  /**
   * @desc 删除站点信息
   * */
  @AuthStrategy()
  @Delete()
  @UsePipes(new ValidateToEmptyPipe(['id']))
  protected deleteSiteConfigHandle (@Body() body) {
    return this.siteConfigService.deleteSiteConfigHandle(body);
  }

  /**
   * @desc 站点信息上传banner图
   * */
  @AuthStrategy()
  @Post('upload')
  @UploadFile('site', 'uploads/site')
  protected siteConfigUploadPic (@UploadedFile() file) {
    return this.siteConfigService.siteConfigUploadPic(file);
  }

  @AuthStrategy()
  @Post('upload/delete')
  @UsePipes(new ValidateToEmptyPipe(['id']))
  protected siteConfigDeletePic (@Body() body) {
    return this.siteConfigService.siteConfigDeletePic(body);
  }

  /**
   * @desc 系统配置 => 配置中心站点配置
   * @desc not auth
   * */
  @Get('site')
  protected getSystemSiteConfigHandle () {
    return this.siteConfigService.getSystemSiteConfigHandle();
  }

  /**
   * @desc 系统配置 => 保存配置中心站点配置
   * */
  @AuthStrategy()
  @Post('site')
  @UsePipes(new ValidateToEmptyPipe([ 'title', 'description', 'keywords', 'author' ]))
  protected setSystemSiteConfigHandle (@Body() body) {
    return this.siteConfigService.setSystemSiteConfigHandle(body);
  }

}
