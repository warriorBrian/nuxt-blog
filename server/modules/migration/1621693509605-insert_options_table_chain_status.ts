import {MigrationInterface, QueryRunner} from "typeorm";

export class insertOptionsTableChainStatus1621693509605 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('chain_status', 1)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DELETE FROM `options` WHERE `key` = 'chain_status'");
    }

}
