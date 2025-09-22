import { MigrationInterface, QueryRunner } from "typeorm";

export class SingleAndGroupConversationSeperate1758190372530 implements MigrationInterface {
    name = 'SingleAndGroupConversationSeperate1758190372530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."single_conversations_status_enum" AS ENUM('pending', 'sent', 'failed')`);
        await queryRunner.query(`CREATE TABLE "single_conversations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "message" character varying NOT NULL, "status" "public"."single_conversations_status_enum" NOT NULL, "group_id" integer NOT NULL, "sender_id" integer NOT NULL, CONSTRAINT "PK_b5c521cbc4037299b7b7090baa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."group_conversations_status_enum" AS ENUM('pending', 'sent', 'failed')`);
        await queryRunner.query(`CREATE TABLE "group_conversations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "message" character varying NOT NULL, "status" "public"."group_conversations_status_enum" NOT NULL, "group_id" integer NOT NULL, "sender_id" integer NOT NULL, CONSTRAINT "PK_46422f0518ac6c749b2eade3293" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "single_conversations" ADD CONSTRAINT "FK_7f120316d195ee7a173e695a326" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "single_conversations" ADD CONSTRAINT "FK_fc2efeaea6f2dc4317e514d0dae" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_conversations" ADD CONSTRAINT "FK_dcb61fc0910b8c9958d9809ab84" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_conversations" ADD CONSTRAINT "FK_2c11c4ad332319b70d7396050ef" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_conversations" DROP CONSTRAINT "FK_2c11c4ad332319b70d7396050ef"`);
        await queryRunner.query(`ALTER TABLE "group_conversations" DROP CONSTRAINT "FK_dcb61fc0910b8c9958d9809ab84"`);
        await queryRunner.query(`ALTER TABLE "single_conversations" DROP CONSTRAINT "FK_fc2efeaea6f2dc4317e514d0dae"`);
        await queryRunner.query(`ALTER TABLE "single_conversations" DROP CONSTRAINT "FK_7f120316d195ee7a173e695a326"`);
        await queryRunner.query(`DROP TABLE "group_conversations"`);
        await queryRunner.query(`DROP TYPE "public"."group_conversations_status_enum"`);
        await queryRunner.query(`DROP TABLE "single_conversations"`);
        await queryRunner.query(`DROP TYPE "public"."single_conversations_status_enum"`);
    }

}
