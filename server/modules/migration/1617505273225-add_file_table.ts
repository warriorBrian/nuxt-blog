import {MigrationInterface, QueryRunner} from "typeorm";

export class addFileTable1617505273225 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS file (
          id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
          file_type CHAR(50) NOT NULL COMMENT "文件类型",
          original_name VARCHAR(255) DEFAULT NULL COMMENT "原文件名称",
          type CHAR(50) DEFAULT 'local' COMMENT "图片上传方式",
          filename VARCHAR(255) DEFAULT NULL COMMENT "格式化过后文件名称",
          size BIGINT(20) DEFAULT 0 COMMENT "文件大小",
          path TEXT DEFAULT NULL COMMENT "文件路径",
          link TEXT DEFAULT NULL COMMENT "链接地址"
        )
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `file`")
  }

}
