import {Controller, Get, Query, Put, Body, UsePipes, Post, Delete} from '@nestjs/common';
import {AuthStrategy} from 'src/auth/auth.decorator';
import {ArchiveService} from './archive.service';
import {ValidateToEmptyPipe} from 'src/pipe/validateToEmptyPipe.pipe';

@Controller('archive')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  /**
   * @desc 获取标签列表
   * @desc 后台展示
   * */
  @AuthStrategy()
  @Get('tag')
  protected getTagLists (@Query() query) {
    return this.archiveService.getTagLists(query);
  }

  /**
   * @desc 获取标签列表
   * @desc not auth
   * */
  @Get('tag/list')
  protected getFrontTagList (@Query() query) {
    return this.archiveService.getTagLists(query);
  }

  /**
   * @desc 创建标签
   * */
  @AuthStrategy()
  @Post('tag')
  @UsePipes(new ValidateToEmptyPipe(['name', 'introduction']))
  protected createTagHandle (@Body() body) {
    return this.archiveService.createTagHandle(body);
  }

  /**
   * @desc 修改标签
   * */
  @AuthStrategy()
  @Put('tag')
  @UsePipes(new ValidateToEmptyPipe(['id', 'name', 'introduction']))
  protected editTagHandle (@Body() body) {
    return this.archiveService.editTagHandle(body);
  }

  /**
   * @desc 删除标签
   * */
  @AuthStrategy()
  @Delete('tag')
  @UsePipes(new ValidateToEmptyPipe(['id']))
  protected deleteTagHandle (@Body() body) {
    return this.archiveService.deleteTagHandle(body);
  }

  /**
   * @desc 文章分类列表
   * */
  @Get('list')
  protected getArchiveLists () {
    return this.archiveService.getArchiveLists();
  }

}
