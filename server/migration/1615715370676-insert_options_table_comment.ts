import {MigrationInterface, QueryRunner} from "typeorm";

export class insertOptionsTableComment1615715370676 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // 评论列表开关配置
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('comment_status', 1)");
      // 评论列表记录IP解析地址开关配置
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('comment_record_ip', 0)");
    }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DELETE FROM `options` WHERE `key` = 'comment_status'");
    await queryRunner.query("DELETE FROM `options` WHERE `key` = 'comment_record_ip'");
  }

}
