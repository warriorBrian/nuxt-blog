import {Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn} from 'typeorm';
import {BaseEntity} from './BaseEntity';
import {UsersEntity} from './users.entity';

@Entity('blacklist')
export class BlacklistEntity extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 50})
  ip: string;

  @Column({width: 11})
  exp: number;

  @Column({width: 11, default: 0})
  count: number;

  @Column({type: 'text'})
  address: string;

  @ManyToOne(() => UsersEntity, user => user.blacklists)
  @JoinColumn({name: 'user_id'})
  user: UsersEntity;

}
