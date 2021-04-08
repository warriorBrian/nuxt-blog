import { DynamicModule, Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {OptionsEntity} from 'src/entity/options.entity';
import {FileEntity} from 'src/entity/file.entity';
import {UploadService} from './upload.service';
@Module({})
export class UploadModule {
  static register (options?: any): DynamicModule {
    return {
      module: UploadModule,
      providers: [UploadService],
      imports: [TypeOrmModule.forFeature([OptionsEntity, FileEntity])],
      exports: [UploadService]
    }
  }
}
