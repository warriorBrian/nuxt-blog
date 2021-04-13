import {Module} from '@nestjs/common';
import {ArchiveController} from './archive.controller';
import {ArchiveService} from './archive.service';

import {TypeOrmModule} from '@nestjs/typeorm';
import {TagsEntity} from 'src/entity/tags.entity';
import {ArticleRelationsTagsEntity} from 'src/entity/articleRelationsTags.entity';
import {ArticleEntity} from 'src/entity/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagsEntity, ArticleRelationsTagsEntity, ArticleEntity])
  ],
  controllers: [ArchiveController],
  providers: [ArchiveService]
})
export class ArchiveModule {}
