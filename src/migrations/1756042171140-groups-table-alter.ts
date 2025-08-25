import { MigrationInterface, QueryRunner } from "typeorm";

export class GroupsTableAlter1756042171140 implements MigrationInterface {
    name = 'GroupsTableAlter1756042171140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" ADD "name" character varying NOT NULL DEFAULT 'my_group'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP COLUMN "name"`);
    }

}
