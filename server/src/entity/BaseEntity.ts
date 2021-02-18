import {BeforeInsert, BeforeUpdate, Column} from 'typeorm';

export class BaseEntity {
  @Column()
  updatedAt: number;

  @Column()
  createdAt: number;

  @BeforeInsert()
  updateDateCreation () {
    this.createdAt = Number(Math.round(new Date().getTime()/1000));
  }

  @BeforeUpdate()
  updateDateUpdate () {
    this.updatedAt = Number(Math.round(new Date().getTime()/1000));
  }

}
