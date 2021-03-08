import {MigrationInterface, QueryRunner} from "typeorm";

export class insertOptionsTableBlacklist1615026986674 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('blacklist_status', 0)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DELETE FROM `options` WHERE `key` = 'blacklist_status'");
    }

}
