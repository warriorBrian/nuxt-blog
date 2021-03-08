import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import {BaseEntity} from './BaseEntity';
import {ArticleEntity} from './article.entity';
import {BlacklistEntity} from './blacklist.entity';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 255})
  username: string;

  @Column({length: 255})
  password: string;

  @OneToMany(() => ArticleEntity, articles => articles.user)
  articles: ArticleEntity;

  @OneToMany(() => BlacklistEntity, blacklist => blacklist.user)
  blacklists: BlacklistEntity;
}
