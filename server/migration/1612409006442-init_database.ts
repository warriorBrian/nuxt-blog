import {MigrationInterface, QueryRunner} from "typeorm";

export class initDatabase1612409006442 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // CREATE TABLE: users
      await queryRunner.query("CREATE TABLE IF NOT EXISTS `users`( `id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `username` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `createdAt` INT(11) DEFAULT 0, `updatedAt` INT(11) DEFAULT 0, UNIQUE KEY (`username`))");
      // INSERT INTO users
      await queryRunner.query("INSERT INTO `users` (`username`, `password`, `createdAt`, `updatedAt`) VALUES ('demo', '196b26013b008893651c62be767bd300', UNIX_TIMESTAMP(), 0)");

      // CREATE TABLE: options
      await queryRunner.query("CREATE TABLE IF NOT EXISTS `options`( `id` INT(11) NOT NULL  PRIMARY KEY AUTO_INCREMENT, `key` VARCHAR(255) NOT NULL, `value` TEXT NOT NULL )");
      // INSERT INTO options to auth_status
      await queryRunner.query("INSERT INTO options(`key`, `value`) VALUES ('auth_status', 0)");

      // CREATE TABLE: google_auth
      await queryRunner.query("CREATE TABLE IF NOT EXISTS `google_auth`( `id` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `ascii` VARCHAR(255) NOT NULL, `hex` VARCHAR(255) NOT NULL, `base32` VARCHAR(255) NOT NULL, `otpauth_url` VARCHAR(255) NOT NULL )");

    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      return false;
    }

}
