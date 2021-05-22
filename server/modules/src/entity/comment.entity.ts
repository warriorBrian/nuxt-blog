import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ColumnType, OneToMany} from 'typeorm';
import {BaseEntity} from './BaseEntity';
import {ArticleEntity} from './article.entity';

@Entity('comment')
export class CommentEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 50})
  ip: string;


  @Column({length: 50})
  username: string;

  @Column({nullable: true, length: 50})
  email: string;

  @Column({width: 1})
  status: number;

  @Column()
  address: string;

  @Column()
  content: string;

  @Column()
  parentId: number;

  @Column({
    transformer: {
      to(value: any): any {
        return value
      },
      from(value: any): any {
        if (value == null) return value;
        return JSON.parse(value);
      }
    }
  })
  sensitive: string;

  @Column({width: 1})
  pass: number;

  @Column()
  original: string;


  @ManyToOne(() => ArticleEntity, article => article.comments)
  @JoinColumn({name: 'article_id'})
  article: ArticleEntity;

}
