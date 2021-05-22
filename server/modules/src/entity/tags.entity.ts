import {Entity, PrimaryGeneratedColumn, Column, ManyToMany} from 'typeorm';
import {ArticleEntity} from './article.entity';
import {BaseEntity} from './BaseEntity';
@Entity('tags')
export class TagsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({width: 255})
  name: string;

  @Column()
  introduction: string;

  @ManyToMany(() => ArticleEntity, article => article.tags)
  articleLists: ArticleEntity[]
}
