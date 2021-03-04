import {MigrationInterface, QueryRunner} from "typeorm";

export class addArticleTable1614663505511 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      // create article table
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS article ( 
        \`id\` INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
        \`title\` VARCHAR(40) NOT NULL,
        \`content\` LONGTEXT NOT NULL,
        introduction VARCHAR(100) NOT NULL,
        original LONGTEXT NOT NULL,
        \`user_id\` INT(11) DEFAULT NULL,
        \`createdAt\` INT(11) DEFAULT 0,
        \`updatedAt\` INT(11) DEFAULT 0,
        UNIQUE KEY(\`title\`)
        )
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('DROP TABLE `article`');
    }

}
