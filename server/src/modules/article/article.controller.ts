import { Controller, Get } from '@nestjs/common';

import {ArticleEntity} from 'src/entity/article.entity';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {plainToClass} from 'class-transformer';

@Controller('article')
export class ArticleController {
  constructor(
    @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>
  ) {}
  @Get()
  async getIndex () {
    const val = plainToClass(ArticleEntity, {name: 'brian'});
    const res = await this.articleRepository.createQueryBuilder('user').insert().into(ArticleEntity).values(val).execute();
    console.log(res, 'res');
  }
}
