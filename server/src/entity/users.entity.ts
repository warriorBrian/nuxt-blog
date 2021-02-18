import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntity} from './BaseEntity';

@Entity('users')
export class UsersEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 255})
  username: string;

  @Column({length: 255})
  password: string;
}
