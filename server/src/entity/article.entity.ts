import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import {BaseEntity} from './BaseEntity';
import {UsersEntity} from './users.entity';
import {CommentEntity} from './comment.entity';
import {TagsEntity} from './tags.entity';
@Entity('article')
export class ArticleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 50, unique: true})
  title: string;

  @Column()
  content: string;

  @Column()
  introduction: string;

  @Column({
    nullable: true,
    transformer: {
      to(value: any): any {
        if (value == '' || value == null) return '';
        return JSON.stringify(value);
      },
      from(value: any): any {
        if (value == null || value == '') return '';
        return JSON.parse(value);
      }
    }
  })
  banner: string;

  @Column()
  original: string;

  @ManyToOne(() => UsersEntity, user => user.articles)
  @JoinColumn({name: 'user_id'})
  user: UsersEntity;

  @OneToMany(() => CommentEntity, comment => comment.article)
  comments: CommentEntity

  @ManyToMany(() => TagsEntity, tag => tag.articleLists)
  @JoinTable({
    name: 'article_relations_tag',
    joinColumn: {
      name: 'article_id'
    },
    inverseJoinColumn: {
      name: 'tag_id'
    }
  })
  tags: TagsEntity[]

}
