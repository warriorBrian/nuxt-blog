import { Module } from '@nestjs/common';
import {ArticleController} from './article.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ArticleEntity} from 'src/entity/article.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity])
  ],
  controllers: [ArticleController],
})
export class ArticleModule {}
