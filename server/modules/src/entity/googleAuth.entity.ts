import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('google_auth')
export class GoogleAuthEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({length: 255})
  ascii: string;

  @Column({length: 255})
  hex: string;

  @Column({length: 255})
  base32: string;

  @Column({length: 255})
  otpauth_url: string;
}
