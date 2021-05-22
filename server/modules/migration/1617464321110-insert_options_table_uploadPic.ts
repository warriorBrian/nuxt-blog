import {MigrationInterface, QueryRunner} from "typeorm";

export class insertOptionsTableUploadPic1617464321110 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // 上传图片类型
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('uploadPic_type', 'local')");
      // 七牛云AK
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('qiniu_accessKey', '')");
      // 七牛云SK
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('qiniu_secretKey', '')");
      // 七牛云bucket
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('qiniu_bucket', '')");
      // 七牛云domain
      await queryRunner.query("INSERT INTO `options` (`key`, `value`) VALUES ('qiniu_domain', '')");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DELETE FROM `options` WHERE `key` = 'uploadPic_type'");
      await queryRunner.query("DELETE FROM `options` WHERE `key` = 'qiniu_accessKey'");
      await queryRunner.query("DELETE FROM `options` WHERE `key` = 'qiniu_secretKey'");
      await queryRunner.query("DELETE FROM `options` WHERE `key` = 'qiniu_bucket'");
      await queryRunner.query("DELETE FROM `options` WHERE `key` = 'qiniu_domain'");
    }

}
