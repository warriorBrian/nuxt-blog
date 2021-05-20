import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
import { BaseEntity } from './BaseEntity';

@Entity('chain')
export class ChainEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length:50, unique: true })
  name: string;

  @Column({ length: 255 })
  link: string;

  @Column({ length: 255 })
  avatarLink: string;

  @Column({ width: 2 })
  status: number;

  @Column({ length: 255 })
  suggest: string;

  @Column({ length: 255 })
  email: string;
}
