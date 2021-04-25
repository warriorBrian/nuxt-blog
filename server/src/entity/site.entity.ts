import {Entity, Column, PrimaryGeneratedColumn, Index} from 'typeorm';
const transformer = {
  to(value: any): any {
    return value;
  },
  from(value: any): any {
    if (value == null) return '';
    return value;
  }
};

@Entity('site')
export class SiteEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({unique: true})
  @Column({nullable: true})
  title: string;

  @Column({
    length: 50,
    transformer
  })
  desc: string;

  @Column({
    length: 50,
    transformer
  })
  subDesc: string;

  @Column({nullable: false})
  type: string;

  @Column({
    nullable: true,
    transformer
  })
  link: string;

  @Column({
    transformer
  })
  linkType: number;

  @Column({
    nullable: true,
    transformer: {
      to(value: any): any {
        if (value == '' || value == null) return '';
        return JSON.stringify(value);
      },
      from(value: any): any {
        if (value == null || value == '') return '';
        return JSON.parse(value);
      }
    }
  })
  banner: string;

  @Column()
  parentId: number;

  @Column({
    nullable: true,
    transformer
  })
  more: string;
}
