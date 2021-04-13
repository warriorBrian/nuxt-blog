import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('article_relations_tag')
export class ArticleRelationsTagsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  article_id: number;

  @Column()
  tag_id: number;
}
