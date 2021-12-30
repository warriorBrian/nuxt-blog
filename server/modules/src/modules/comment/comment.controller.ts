import {Controller, Post, Body, Query, Get, UsePipes, Delete, UploadedFile, UseInterceptors, HttpService, Headers} from '@nestjs/common';
import {CommentService} from './comment.service';
import {AuthStrategy} from 'src/auth/auth.decorator';
import {ValidateToEmptyPipe} from 'src/pipe/validateToEmptyPipe.pipe';

import { UploadFile } from 'src/core/decorators/file.decorators'

import { RateLimit, RateLimiterInterceptor } from 'nestjs-rate-limiter';

@Controller('comment')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly httpService: HttpService
  ) {}

  /**
   * @desc comment lists
   * private
   * */
  @AuthStrategy()
  @Get()
  protected commentLists (@Query() query) {
    return this.commentService.commentLists(query);
  }

  /**
   * @desc 评论列表展示文章
   * */
  @AuthStrategy()
  @Get('articleRelations')
  protected articleRelationsComment () {
    return this.commentService.articleRelationsComment();
  }


  /**
   * @desc 关联文章评论列表
   * @desc not auth
   * @param query {object} article_id 关联文章id
   * */
  @Get('list')
  @UsePipes(new ValidateToEmptyPipe(['article_id']))
  protected commentRelevanceList (@Query() query) {
    return this.commentService.commentRelevanceList(query);
  }

  /**
   * @desc create comment
   * @type public
   * */
  @Post()
  @UsePipes(new ValidateToEmptyPipe([ 'email', 'username', 'content', 'article_id' ]))
  @RateLimit({ points: 5, duration: 60})
  @UseInterceptors(RateLimiterInterceptor)
  protected createComment (@Body() body, @Headers('ip') ip) {
    return this.commentService.createComment(body, ip);
  }

  /**
   * @desc 删除评论
   * */
  @AuthStrategy()
  @Delete()
  @UsePipes(new ValidateToEmptyPipe(['id']))
  protected deleteComment (@Body() body) {
    return this.commentService.deleteComment(body);
  }

  /**
   * ===================评论配置=========================
   * */
  /**
   * @desc 获取平乱开启状态
   * @desc not auth
   * */
  @Get('/switch')
  protected getCommentSwitchStatus () {
    return this.commentService.getCommentSwitchStatus(['comment_status', 'comment_record_ip']);
  }
  /**
   * @desc 获取评论开启状态及记录IP状态
   * */
  @AuthStrategy()
  @Get('/status/switch')
  protected getCommentStatus () {
    return this.commentService.getCommentStatus(['comment_status', 'comment_record_ip']);
  }

  /**
   * @desc 开启关闭评论
   * private
   * */
  @AuthStrategy()
  @UsePipes(new ValidateToEmptyPipe(['status', 'field']))
  @Post('comment-status')
  protected changeCommentStatus (@Body() body) {
    return this.commentService.changeCommentStatus(body);
  }

  /**
   * @desc 上传敏感词文件
   * @param file {File}
   * */
  @AuthStrategy()
  @Post('upload')
  @UploadFile('keywords', 'uploads/keywords', { filter: ['txt'] })
  protected uploadKeywordsFile (@UploadedFile() file) {
    return this.commentService.uploadKeywordsFile(file);
  }

  /**
   * @desc 敏感词文件列表
   * */
  @AuthStrategy()
  @Get('upload/list')
  protected uploadKeyWordsLists () {
    return this.commentService.uploadKeyWordsLists();
  }

  /**
   * @desc 删除敏感词文件及列表
   * */
  @AuthStrategy()
  @Delete('upload/delete')
  @UsePipes(new ValidateToEmptyPipe(['id']))
  protected uploadKeyWordsDelete (@Body() body) {
    return this.commentService.uploadKeyWordsDelete(body);
  }

  /**
   * @desc 检测识别文本敏感词
   * @param body {object} 敏感词文本
   * */
  @AuthStrategy()
  @Post('detection/sensitive')
  @UsePipes(new ValidateToEmptyPipe([ 'text' ]))
  protected detectionSensitiveWords (@Body() body) {
    return this.commentService.detectionSensitiveWords(body);
  }

}


