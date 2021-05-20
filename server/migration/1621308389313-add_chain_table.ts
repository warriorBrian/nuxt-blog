import {MigrationInterface, QueryRunner} from "typeorm";

export class addChainTable1621308389313 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS chain (
          id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
          \`name\` VARCHAR(50) NOT NULL COMMENT "名称",
          link VARCHAR(255) DEFAULT NULL COMMENT "链接",
          avatarLink VARCHAR(255) DEFAULT NULL COMMENT "头像链接",
          status INT(2) DEFAULT 0 COMMENT "审核状态",
          email VARCHAR(255) DEFAULT NULL COMMENT "邮箱",
          suggest VARCHAR(255) DEFAULT NULL COMMENT "审核建议",
          createdAt INT(11) DEFAULT 0 COMMENT "创建时间",
          updatedAt INT(11) DEFAULT 0 COMMENT "最后更新时间",
          UNIQUE KEY(\`name\`)
        )
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DROP TABLE `chain`");
    }

}
