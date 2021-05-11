import {Module, NestModule, MiddlewareConsumer, RequestMethod} from '@nestjs/common';
import {SiteConfigController} from './siteConfig.controller';
import {SiteConfigService} from './siteConfig.service';
import {SiteEntity} from 'src/entity/site.entity';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UploadModule} from 'src/upload/upload.module';

// 配置黑名单依赖
import { BlacklistMiddleware } from 'src/middleware/blacklist.middleware';
import { BlacklistEntity } from 'src/entity/blacklist.entity';
import { OptionsEntity } from 'src/entity/options.entity';
import { LocationModule } from 'src/modules/location/location.module';

@Module({
  imports: [
    LocationModule,
    TypeOrmModule.forFeature([SiteEntity, BlacklistEntity, OptionsEntity]),
    UploadModule.register()
  ],
  controllers: [SiteConfigController],
  providers: [SiteConfigService]
})
export class SiteConfigModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(BlacklistMiddleware).forRoutes(
      { path: 'site-config/list', method: RequestMethod.GET }
    );
  }
}
