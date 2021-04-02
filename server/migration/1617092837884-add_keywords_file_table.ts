import {MigrationInterface, QueryRunner} from "typeorm";

export class addKeywordsFileTable1617092837884 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS keywords_file (
          id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
          original_name VARCHAR(255) DEFAULT NULL COMMENT "原文件名称",
          type CHAR(50) DEFAULT NULL COMMENT "文件类型",
          filename VARCHAR(255) DEFAULT NULL COMMENT "格式化过后文件名称",
          size BIGINT(20) DEFAULT 0 COMMENT "文件大小",
          path TEXT DEFAULT NULL COMMENT "文件路径"
        )
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DROP TABLE `keywords_file`")
    }

}
