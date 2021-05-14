import {MigrationInterface, QueryRunner} from "typeorm";

export class insertOptionsTableSite1620635482952 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('site_config', '{\"title\": \"\", \"description\": \"\", \"keywords\": \"\", \"author\": \"\", \"record\": \"\"}')");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DELETE FROM `options` WHERE `key` = 'site_config'");
    }

}
