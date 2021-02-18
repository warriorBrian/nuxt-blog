import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {} from '@nestjs/typeorm';
import {BaseEntity} from './BaseEntity';

@Entity('article')
export class ArticleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 500})
  name: string;

}
