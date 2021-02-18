import {MigrationInterface, QueryRunner} from "typeorm";

export class addArticleRules1612512107133 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("CREATE TABLE `article`( id INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT, `name` VARCHAR(255) NOT NULL, `createdAt` INT(11) DEFAULT 0, `updatedAt` INT(11) DEFAULT 0 )");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("DROP TABLE `article`");
    }

}
