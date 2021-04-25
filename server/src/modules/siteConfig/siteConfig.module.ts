import {Module} from '@nestjs/common';
import {SiteConfigController} from './siteConfig.controller';
import {SiteConfigService} from './siteConfig.service';
import {SiteEntity} from 'src/entity/site.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UploadModule} from 'src/upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SiteEntity]),
    UploadModule.register()
  ],
  controllers: [SiteConfigController],
  providers: [SiteConfigService]
})
export class SiteConfigModule {}
