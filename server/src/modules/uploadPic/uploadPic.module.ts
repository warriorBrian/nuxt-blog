import {Module, HttpModule} from '@nestjs/common';
import {UploadPicController} from './uploadPic.controller';
import {UploadPicService} from './uploadPic.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {OptionsEntity} from 'src/entity/options.entity';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([OptionsEntity])
  ],
  controllers: [UploadPicController],
  providers: [UploadPicService]
})
export class UploadPicModule {}
