import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueUserGroup1761045017027 implements MigrationInterface {
    name = 'UniqueUserGroup1761045017027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_groups" ADD CONSTRAINT "UQ_8bc894be6cf4f6d60a458219c2e" UNIQUE ("member_id", "group_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users_groups" DROP CONSTRAINT "UQ_8bc894be6cf4f6d60a458219c2e"`);
    }

}
