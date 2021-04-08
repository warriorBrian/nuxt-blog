import { Module } from '@nestjs/common';
import {APP_FILTER, APP_INTERCEPTOR} from '@nestjs/core';

import {ArticleModule} from 'src/modules/article/article.module';
import {AuthModule} from 'src/auth/auth.module';
import {LoginModule} from 'src/modules/login/login.module';
import {GoogleAuthModule} from 'src/modules/googleAuth/googleAuth.module';
import {LocationModule} from 'src/modules/location/location.module';
import {UsersModule} from 'src/modules/users/users.module';
import {BlacklistModule} from 'src/modules/blackList/blacklist.module';
import {CommentModule} from 'src/modules/comment/comment.module';
import {UploadPicModule} from 'src/modules/uploadPic/uploadPic.module';

import {TypeOrmModule} from '@nestjs/typeorm';

import {HttpExceptionFilter} from 'src/exception/http-exception.filter';
import {ResponseInterceptor} from 'src/interceptors/response.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    AuthModule,
    LoginModule,
    ArticleModule,
    GoogleAuthModule,
    LocationModule,
    UsersModule,
    BlacklistModule,
    CommentModule,
    UploadPicModule
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
