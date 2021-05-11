import {MigrationInterface, QueryRunner} from "typeorm";

export class addArticleTable1614663505511 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // create article table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS article ( 
        \`id\` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        \`title\` VARCHAR(50) NOT NULL,
        \`content\` LONGTEXT NOT NULL,
        introduction TEXT NOT NULL,
        original LONGTEXT NOT NULL,
        banner VARCHAR(255) DEFAULT NULL COMMENT "站点banner",
        \`user_id\` INT(11) DEFAULT NULL,
        \`createdAt\` INT(11) DEFAULT 0,
        \`updatedAt\` INT(11) DEFAULT 0,
        UNIQUE KEY(\`title\`)
        ) DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TABLE `article`');
    }

}
