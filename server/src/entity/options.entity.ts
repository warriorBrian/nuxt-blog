import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('options')
export class OptionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique:true})
  key: string;

  @Column()
  value: string;
}
