import { Controller, Get, Post, Headers, Body, Query, UsePipes, Delete, Param, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import {ArticleService} from './article.service';
import {getTokenToString} from 'src/core/lib';
import {AuthStrategy} from 'src/auth/auth.decorator';
import {AuthService} from 'src/auth/auth.service';
import {CreateArticleInterface, ModifyArticle} from 'src/interfaces/article.interface';
import {ValidateToEmptyPipe} from 'src/pipe/validateToEmptyPipe.pipe';
import { RateLimit, RateLimiterInterceptor } from 'nestjs-rate-limiter';

import {UploadFile} from 'src/core/decorators/file.decorators';

@Controller('article')
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly authService: AuthService
  ) {}

  /**
   * @desc Article list
   * @desc Required auth
   * */
  @AuthStrategy()
  @Get()
  async getArticleList (@Query() query, @Headers('authorization') authorization) {
    const { user } = await this.authService.validate(getTokenToString(authorization));
    return this.articleService.getArticleList(query, user);
  }

  /**
   * @desc Article list
   * @desc not auth
   * */

  @Get('list')
  getFrontArticleList (@Query() query) {
    return this.articleService.getFrontArticleList(query);
  }

  /**
   * @desc Article detail
   * @desc not auth
   * */
  @Get('/detail/:id')
  getArticleDetail (@Param('id') id) {
    return this.articleService.getArticleDetail(id);
  }

  /**
   * @desc Edit Article Presentation
   * @desc Required auth
   * */
  @AuthStrategy()
  @Get('/edit/:id')
  protected async editArticlePresentation (@Param('id') id, @Headers('authorization') authorization) {
    const { user } = await this.authService.validate(getTokenToString(authorization));
    return this.articleService.editArticlePresentation(id, user);
  }

  /**
   * @desc Modify Article
   * @desc Required auth
   * */
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe(['id', 'title', 'content', 'introduction', 'original', 'tag_id', 'banner']))
  @Put()
  protected async editArticle (@Body() body: Required<ModifyArticle>, @Headers('authorization') authorization) {
    const { user } = await this.authService.validate(getTokenToString(authorization));
    return this.articleService.editArticle(body, user);
  }

  /**
   * @desc Create article
   * @desc Required auth
   * */
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe(['title', 'content', 'original', 'introduction', 'tag_id', 'banner']))
  @RateLimit({ points: 10, duration: 60})
  @UseInterceptors(RateLimiterInterceptor)
  @Post('create')
  protected async createArticle (@Body() data: Required<CreateArticleInterface>, @Headers('authorization') authorization) {
    const { user } = await this.authService.validate(getTokenToString(authorization));
    return this.articleService.createArticle(data, user);
  }

  /**
   * @desc Delete Article
   * @desc Required auth
   * */
  @AuthStrategy()
  @Delete()
  protected async deleteArticle (@Body('id') id, @Headers('authorization') authorization) {
    const { user } = await this.authService.validate(getTokenToString(authorization));
    return this.articleService.deleteArticle(id, user);
  }

  /**
   * @desc 文章上传图片
   * */
  @AuthStrategy()
  @Post('upload')
  @UploadFile('article', 'uploads/images')
  protected async articleUploadPic (@UploadedFile() file) {
    return this.articleService.articleUploadPic(file);
  }

  /**
   * @desc 文章删除图片
   * */
  @AuthStrategy()
  @Post('upload/delete')
  @UsePipes(new ValidateToEmptyPipe(['id']))
  protected async articleDeletePic (@Body() body) {
    return this.articleService.articleDeletePic(body);
  }

}
