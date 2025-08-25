import { MigrationInterface, QueryRunner } from "typeorm";

export class MessageStatus1755840838385 implements MigrationInterface {
    name = 'MessageStatus1755840838385'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."messages_status_enum" AS ENUM('pending', 'sent', 'failed')`);
        await queryRunner.query(`ALTER TABLE "messages" ADD "status" "public"."messages_status_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."messages_status_enum"`);
    }

}
