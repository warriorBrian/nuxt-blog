import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 255})
  original_name: string;

  @Column({length: 50})
  file_type: string;

  @Column({length: 50})
  type: string;

  @Column({length: 255})
  filename: string;

  @Column({width: 20})
  size: number;

  @Column()
  link: string;

  @Column()
  path: string;
}
