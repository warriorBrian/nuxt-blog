import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import {ArticleController} from './article.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ArticleEntity} from 'src/entity/article.entity';
import {ArticleService} from './article.service';
import {AuthModule} from 'src/auth/auth.module';
import { RateLimiterModule } from 'nestjs-rate-limiter';

// 配置黑名单依赖
import { BlacklistMiddleware } from 'src/middleware/blacklist.middleware';
import { BlacklistEntity } from 'src/entity/blacklist.entity';
import { OptionsEntity } from 'src/entity/options.entity';
import { LocationModule } from 'src/modules/location/location.module';

// 图片上传模块
import {UploadModule} from 'src/upload/upload.module';

@Module({
  imports: [
    RateLimiterModule,
    AuthModule,
    LocationModule,
    TypeOrmModule.forFeature([ArticleEntity, BlacklistEntity, OptionsEntity]),
    UploadModule.register()
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(BlacklistMiddleware).forRoutes(
      { path: 'article/list', method: RequestMethod.GET },
      { path: 'article/detail/:id', method: RequestMethod.GET },
    );
  }
}
