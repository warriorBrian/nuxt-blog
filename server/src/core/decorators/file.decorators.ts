import {UseInterceptors, applyDecorators, BadRequestException} from '@nestjs/common';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import { FilesOptions } from 'src/interfaces/multer.interface';

const FileFilter = (req, file, callback, filter) => {
  const fileType = file.originalname.substring(file.originalname.indexOf('.') + 1);
  if (filter.length === 0) {
    return callback(null, true);
  }
  if (!filter.includes(fileType)) {
    return callback(new BadRequestException('文件格式不符合规范'), false);
  }
  callback(null, true);
};

const storage = (path: string, original: boolean) => diskStorage({
  destination: path,
  filename: function (req, file, cb) {
    const fileType = file.originalname.substring(file.originalname.indexOf('.'));
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileType)
  }
});

/**
 * @desc 上传单个文件装饰器
 * @param fieldName {string} 文件上传字段
 * @param uploadFilePath {string} 文件上传路径
 * @param options {Object} 其他配置项，可覆盖默认项
 * */

export const UploadFile = (fieldName: string, uploadFilePath: string, options?: FilesOptions) => {
  const { filter, original, ...args } = Object.assign({}, { filter: [], original: false }, options);
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, {
      storage: storage(uploadFilePath, original),
      fileFilter: (req, file, callback) => FileFilter(req, file, callback, filter),
      ...args
    }))
  )
};
