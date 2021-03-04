import { Module } from '@nestjs/common';
import {ArticleController} from './article.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ArticleEntity} from 'src/entity/article.entity';
import {ArticleService} from './article.service';
import {AuthModule} from 'src/auth/auth.module';
import { RateLimiterModule } from 'nestjs-rate-limiter';

@Module({
  imports: [
    RateLimiterModule,
    AuthModule,
    TypeOrmModule.forFeature([ArticleEntity])
  ],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
