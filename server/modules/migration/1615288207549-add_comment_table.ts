import {MigrationInterface, QueryRunner} from "typeorm";

export class addCommentTable1615288207549 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS comment (
          id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
          ip CHAR(50) DEFAULT NULL COMMENT "ip地址",
          username CHAR(50) NOT NULL COMMENT "用户名",
          email CHAR(50) NOT NULL COMMENT "邮箱地址",
          \`status\` INT(1) DEFAULT 1 COMMENT "显示状态",
          address TEXT DEFAULT NULL COMMENT "IP解析地址",
          content TEXT NOT NULL COMMENT "评论内容",
          article_id INT(11) DEFAULT NULL COMMENT "关联id",
          \`sensitive\` TEXT DEFAULT NULL COMMENT "敏感词组",
          pass INT(1) DEFAULT 1 COMMENT "是否通过敏感词校验",
          original TEXT NOT NULL COMMENT "原始评论内容",
          parentId INT(11) DEFUALT 0 COMMENT "父级id",
          createdAt INT(11) DEFAULT 0 COMMENT "创建时间",
          updatedAt INT(11) DEFAULT 0 COMMENT "最后更新时间"
        )
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TABLE `comment`')
    }

}
