import {Injectable, BadRequestException} from '@nestjs/common';

import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {OptionsEntity} from 'src/entity/options.entity';
import {FileEntity} from 'src/entity/file.entity';

import * as qiniu from 'qiniu';
import { MESSAGES } from 'src/core/enums/message.enum';
import * as fs from 'fs';

interface QiniuConfig {
  qiniu_accessKey: string;
  qiniu_secretKey: string;
  qiniu_bucket: string;
  qiniu_domain: string;
  uploadPic_type: string;
}

interface Keys {
  [index: string]: any;
}

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(OptionsEntity) private readonly optionsRepository: Repository<OptionsEntity>,
    @InjectRepository(FileEntity) private readonly fileRepository: Repository<FileEntity>
  ) {}

  /**
   * @desc 七牛云上传
   * */
  private QiniuPutFile (uploadToken, file, putExtra): any {
    const configs = new qiniu.conf.Config();
    const formUploader = new qiniu.form_up.FormUploader(configs);
    return new Promise((resolve, reject) => {
      formUploader.putFile(uploadToken, file.filename, file.path, putExtra, function (respErr, respBody, respInfo) {
        if (respErr) {
          reject(respErr);
        }
        resolve({ respBody, respInfo })
      })
    });
  }

  /**
   * @desc 七牛云删除
   * */
  private async QiniuDeleteFile (filename) {
    const {qiniu_accessKey, qiniu_secretKey, qiniu_bucket} = await this.findOptions();
    const mac = new qiniu.auth.digest.Mac(qiniu_accessKey, qiniu_secretKey);
    const config = new qiniu.conf.Config();
    const bucketManager = new qiniu.rs.BucketManager(mac, config);
    return new Promise((resolve, reject) => {
      bucketManager.delete(qiniu_bucket, filename, function(err, respBody, respInfo) {
        if (err) {
          reject(err);
        }
        resolve({respBody, respInfo})
      });
    });
  }

  private async deleteFile (file) {
    if (!fs.existsSync(file)) {
      // 文件不存在
      throw new BadRequestException(MESSAGES.FILE_NOT_EXISTS_ERROR);
    }
    // 删除文件
    await fs.unlinkSync(file);
  }

  private async qiniuUpload (file: any, config: QiniuConfig, file_type) {
    const { qiniu_bucket, qiniu_domain, qiniu_accessKey, qiniu_secretKey } = config;
    const options = {
      scope: qiniu_bucket
    };
    const mac = new qiniu.auth.digest.Mac(qiniu_accessKey, qiniu_secretKey);
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    const putExtra = new qiniu.form_up.PutExtra();

    try {
      const { respBody } = await this.QiniuPutFile(uploadToken, file, putExtra);
      const {originalname, filename, size} = file;
      // 删除本地文件，不保留缓存文件
      this.deleteFile(file.path);
      // 将数据存储至数据库
      const value = {original_name: originalname, type: config.uploadPic_type, file_type: file_type, filename, size, link: `//${qiniu_domain}/${respBody.key}` };
      const { link, id } = await this.fileRepository.save(value);

      return { link, id };

    } catch (e) {
      this.deleteFile(file.path);
      throw new BadRequestException(e);
    }

  }

  private async localUpload (file: any, config, file_type) {
    const {originalname, filename, size, path} = file;
    // prefix 与 main.ts中的 useStaticAssets 参数值对应
    const prefix = '/static';
    const virtualPath = file.destination.substring(file.destination.indexOf('/'));
    const entityPath = `${prefix}${virtualPath}/${file.filename}`;
    // 将数据存储至数据库
    console.log(entityPath, 'path');
    const value = {original_name: originalname, type: config.uploadPic_type, file_type: file_type, filename, size, path, link: entityPath };
    const { link, id } = await this.fileRepository.save(value);
    return { link, id };
  }

  private async findOptions () {
    const keys = ['uploadPic_type', 'qiniu_accessKey', 'qiniu_secretKey', 'qiniu_bucket', 'qiniu_domain'];
    const uploadConfig = await this.optionsRepository.createQueryBuilder('options')
      .select(['options.key', 'options.value'])
      .where('options.key IN (:...keys)', { keys })
      .getMany();
    return uploadConfig.reduce((acc,val) => (void(acc[val.key] = val.value) || acc), {} as any);
  }

  /**
   * @desc 上传图片公共方法
   * @desc 仅用于上传图片时
   * */
  public async upload (file: File, file_type: string) {
    // 查询配置数据
    const config = await this.findOptions();
    const type = config.uploadPic_type;
    // 调用对应方法
    const mapping = {
      'qiniu': this.qiniuUpload.bind(this),
      'local': this.localUpload.bind(this)
    };
    return mapping[type](file, config, file_type);
  }

  /**
   * @desc 七牛云删除
   * */
  private async qiniuDelete ({ filename, id }) {
    try {
      const { respInfo } = await this.QiniuDeleteFile(filename) as Keys;
      if (respInfo.statusCode === 200) {
        // 七牛云删除以后，删除对应数据库数据
        const {raw: { affectedRows } } = await this.fileRepository.createQueryBuilder()
          .delete()
          .where('id = :id', { id })
          .execute();
        return {message: `成功删除${affectedRows}条`};
      }
    } catch (e) {
      // 抛出错误
      throw new BadRequestException(e);
    }
  }

  /**
   * @desc 本地删除
   * */
  private async localDelete ({ path, id }) {
    if (!fs.existsSync(path)) {
      // 文件不存在
      throw new BadRequestException(MESSAGES.FILE_NOT_EXISTS_ERROR);
    }
    // 删除文件
    await fs.unlinkSync(path);

    const {raw: { affectedRows } } = await this.fileRepository.createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return {message: `成功删除${affectedRows}条`};

  }

  /**
   * @desc 删除图片公共方法
   * */
  public async delete (id: number, file_type: string) {
    const imageData = await this.fileRepository.createQueryBuilder('file')
      .where('id =:id', { id })
      .andWhere('file_type =:type', {type: file_type})
      .getOne();
    if (!imageData) {
      throw new BadRequestException(MESSAGES.DATA_NOT_EXISTS_ERROR);
    }

    const deleteMapping = {
      'local': this.localDelete.bind(this),
      'qiniu': this.qiniuDelete.bind(this)
    };

    // 根据类型调用不同方法
    return deleteMapping[imageData.type](imageData);

  }

}
