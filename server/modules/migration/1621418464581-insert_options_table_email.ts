import {MigrationInterface, QueryRunner} from "typeorm";

export class insertOptionsTableEmail1621418464581 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('email', '{\"host\": \"\",\"port\": \"\",\"secure\": false,\"auth\": {\"user\": \"\",\"pass\": \"\"}}')");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DELETE FROM `options` WHERE `key` = 'email'");
    }

}
