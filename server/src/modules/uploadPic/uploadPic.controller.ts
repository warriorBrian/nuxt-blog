import {Controller, Get, Post, Body, UsePipes} from '@nestjs/common';
import {AuthStrategy} from 'src/auth/auth.decorator';
import {UploadPicService} from './uploadPic.service';
import {ValidateToEmptyPipe} from 'src/pipe/validateToEmptyPipe.pipe';

@Controller('uploadPic')
export class UploadPicController {
  constructor(private readonly uploadPicService: UploadPicService) {}

  /**
   * @desc 获取图片存储方式
   * */
  @AuthStrategy()
  @Get()
  protected getUploadPicType () {
    return this.uploadPicService.getUploadPicType();
  }

  /**
   * @desc 修改图片存储方式
   * @param body {string}
   * */
  @AuthStrategy()
  @Post()
  @UsePipes(new ValidateToEmptyPipe([ 'type' ]))
  protected changeUploadPicType (@Body() body) {
    return this.uploadPicService.changeUploadPicType(body);
  }

  /**
   * @desc 获取七牛云AK/SK
   * */
  @AuthStrategy()
  @Get('qiniu')
  protected getQiniuSecretKey () {
    return this.uploadPicService.getQiniuSecretKey();
  }

  /**
   * @desc 获取七牛云服务
   * @desc bucket/domain
   * */
  @AuthStrategy()
  @Post('qiniu/service')
  @UsePipes(new ValidateToEmptyPipe(['ak', 'sk', 'type']))
  protected getQiniuService (@Body() body) {
    return this.uploadPicService.getQiniuService(body);
  }

  /**
   * @desc 更新七牛云配置
   * */
  @AuthStrategy()
  @Post('qiniu')
  @UsePipes(new ValidateToEmptyPipe([ 'qiniu_accessKey', 'qiniu_bucket', 'qiniu_domain', 'qiniu_secretKey' ]))
  protected updateQiniuSecretKey (@Body() body) {
    return this.uploadPicService.updateQiniuSecretKey(body);
  }

}
