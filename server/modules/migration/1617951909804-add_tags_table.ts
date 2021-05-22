import {MigrationInterface, QueryRunner} from "typeorm";

export class addTagsTable1617951909804 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS tags (
          id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL COMMENT "标签名称",
          introduction TEXT DEFAULT NULL COMMENT "标签简介",
          createdAt INT(11) DEFAULT 0 COMMENT "创建时间",
          updatedAt INT(11) DEFAULT 0 COMMENT "最后更新时间",
          UNIQUE KEY(\`name\`)
        )
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DROP TABLE `tags`")
    }

}
