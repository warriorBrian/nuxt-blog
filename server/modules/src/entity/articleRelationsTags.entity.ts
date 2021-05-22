import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from 'typeorm';
import {ArticleEntity} from './article.entity';
@Entity('article_relations_tag')
export class ArticleRelationsTagsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ArticleEntity)
  @JoinColumn({name: 'article_id'})
  @Column()
  article_id: number;

  @Column()
  tag_id: number;

  // @OneToOne(() => ArticleEntity)
  // @JoinColumn()
  // articleLists: ArticleEntity;
}
