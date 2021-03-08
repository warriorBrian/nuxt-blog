import {MigrationInterface, QueryRunner} from "typeorm";

export class addBlacklistTable1614928395430 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS blacklist (
          id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
          address TEXT DEFAULT NULL COMMENT "IP解析地址",
          ip CHAR(50) NOT NULL COMMENT "ip地址",
          exp INT(11) NOT NULL COMMENT "过期时间",
          count INT(11) DEFAULT 0 COMMENT "IP访问次数",
          user_Id INT(11) DEFAULT NULL COMMENT "关联用户id",
          createdAt INT(11) DEFAULT 0 COMMENT "创建时间",
          updatedAt INT(11) DEFAULT 0 COMMENT "最后更新时间",
          UNIQUE KEY(\`ip\`)
        )
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DROP TABLE `blacklist`");
    }

}
