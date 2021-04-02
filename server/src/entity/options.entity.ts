import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity('options')
export class OptionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique:true})
  key: string;

  @Column({
    transformer: {
      to(value: any): any {
        return value
      },
      from(value: any): any {
        if (value == null) return value;
        try {
          return JSON.parse(value)
        } catch (e) {
          return value;
        }
      }
    }
  })
  value: string;
}
