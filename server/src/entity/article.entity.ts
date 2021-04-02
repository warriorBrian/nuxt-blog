import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import {BaseEntity} from './BaseEntity';
import {UsersEntity} from './users.entity';
import {CommentEntity} from './comment.entity';

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

  @Column()
  original: string;

  @ManyToOne(() => UsersEntity, user => user.articles)
  @JoinColumn({name: 'user_id'})
  user: UsersEntity;

  @OneToMany(() => CommentEntity, comment => comment.article)
  comments: CommentEntity

}
