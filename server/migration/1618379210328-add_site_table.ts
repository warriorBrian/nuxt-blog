import {MigrationInterface, QueryRunner} from "typeorm";

export class addSiteTable1618379210328 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // 创建site表
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS site (
          id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(50) DEFAULT NULL COMMENT "标题",
          \`desc\` VARCHAR(50) DEFAULT NULL COMMENT "简介",
          subDesc VARCHAR(50) DEFAULT NULL COMMENT "副标题",
          type CHAR(10) NOT NULL COMMENT "类型",
          link VARCHAR(255) DEFAULT NULL COMMENT "导航链接",
          linkType INT(11) DEFAULT 0 COMMENT "跳转类型",
          banner VARCHAR(255) DEFAULT NULL COMMENT "站点banner",
          parentId INT(11) DEFAULT 0 COMMENT "父级id，处理为树形结构",
          more TEXT DEFAULT NULL COMMENT "更多配置",
          UNIQUE KEY(\`title\`)
        )
      `);
      // 插入默认site表数据
      await queryRunner.query("INSERT INTO `site` (`title`, `type`, `link`, `linkType`) VALUES ('blog', 'index', 'index', 0)");
      // 插入默认归档数据
      await queryRunner.query("INSERT INTO `site` (`title`, `type`, `link`, `linkType`) VALUES ('归档', 'navigation', '/archive', 0)")
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DROP TABLE `site`");
    }

}
