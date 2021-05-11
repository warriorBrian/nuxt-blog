import {MigrationInterface, QueryRunner} from "typeorm";

export class insertOptionsTableGeetest1619329382029 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('geetest_id', '')");
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('geetest_key', '')");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DELETE FROM `options` WHERE `key` = 'geetest_id'");
      await queryRunner.query("DELETE FROM `options` WHERE `key` = 'geetest_key'");
    }

}
