import {MigrationInterface, QueryRunner} from "typeorm";

export class articleRelationsTag1617947872584 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS article_relations_tag (
          id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
          article_id INT(11) NOT NULL COMMENT "文章id",
          tag_id INT(11) NOT NULL COMMENT "标签id"
        )
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DROP TABLE `article_relations_tag`");
    }

}
