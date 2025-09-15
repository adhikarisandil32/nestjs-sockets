import { MigrationInterface, QueryRunner } from "typeorm";

export class BidirectionUserGroupUsergroupEntity1757017970225 implements MigrationInterface {
    name = 'BidirectionUserGroupUsergroupEntity1757017970225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups_users" DROP CONSTRAINT "FK_1d26452f47bb5f3b90b68f2c5e7"`);
        await queryRunner.query(`ALTER TABLE "groups_users" ALTER COLUMN "member_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "groups_users" ADD CONSTRAINT "FK_1d26452f47bb5f3b90b68f2c5e7" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups_users" DROP CONSTRAINT "FK_1d26452f47bb5f3b90b68f2c5e7"`);
        await queryRunner.query(`ALTER TABLE "groups_users" ALTER COLUMN "member_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "groups_users" ADD CONSTRAINT "FK_1d26452f47bb5f3b90b68f2c5e7" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
