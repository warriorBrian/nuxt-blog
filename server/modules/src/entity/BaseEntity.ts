import {BeforeInsert, BeforeUpdate, Column} from 'typeorm';

export class BaseEntity {
  @Column()
  updatedAt: number;

  @Column()
  createdAt: number;

  @BeforeInsert()
  updateDateCreation () {
    const time = Number(Math.round(new Date().getTime()/1000));
    this.createdAt = time;
    this.updatedAt = time;
  }

  @BeforeUpdate()
  updateDateUpdate () {
    this.updatedAt = Number(Math.round(new Date().getTime()/1000));
  }

}
