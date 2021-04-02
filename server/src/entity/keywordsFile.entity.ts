import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('keywords_file')
export class KeywordsFileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 255})
  original_name: string;

  @Column({length: 50})
  type: string;

  @Column({length: 255})
  filename: string;

  @Column({width: 20})
  size: number;

  @Column()
  path: string;
}
