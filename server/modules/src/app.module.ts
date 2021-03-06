import { Module } from '@nestjs/common';
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import {ArticleModule} from 'src/modules/article/article.module';
import {AuthModule} from 'src/auth/auth.module';
import {LoginModule} from 'src/modules/login/login.module';
import {GoogleAuthModule} from 'src/modules/googleAuth/googleAuth.module';
import {LocationModule} from 'src/modules/location/location.module';
import {UsersModule} from 'src/modules/users/users.module';
import {BlacklistModule} from 'src/modules/blackList/blacklist.module';
import {CommentModule} from 'src/modules/comment/comment.module';
import {UploadPicModule} from 'src/modules/uploadPic/uploadPic.module';
import {ArchiveModule} from 'src/modules/archive/archive.module';
import {SiteConfigModule} from 'src/modules/siteConfig/siteConfig.module';
import {GeetestModule} from 'src/modules/geetest/geetest.module';
import {PrometheusModule} from 'src/modules/prometheus/prometheus.module';
import { ChainModule } from 'src/modules/chain/chain.module';
import { EmailModule } from 'src/modules/email/email.module';

import {TypeOrmModule} from '@nestjs/typeorm';

import {HttpExceptionFilter} from 'src/exception/http-exception.filter';
import {ResponseInterceptor} from 'src/interceptors/response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    AuthModule,
    LoginModule,
    ArticleModule,
    GoogleAuthModule,
    LocationModule,
    UsersModule,
    BlacklistModule,
    CommentModule,
    UploadPicModule,
    ArchiveModule,
    SiteConfigModule,
    GeetestModule,
    PrometheusModule,
    ChainModule,
    EmailModule
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class AppModule {}
