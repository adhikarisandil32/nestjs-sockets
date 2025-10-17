import { MigrationInterface, QueryRunner } from "typeorm";

export class LastReadConversationTable1760689832050 implements MigrationInterface {
    name = 'LastReadConversationTable1760689832050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "single_conversation_reads" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "requesting_user_id" integer NOT NULL, "requested_user_id" integer NOT NULL, "last_read_conversation_id" integer NOT NULL, CONSTRAINT "PK_c8c06d77f1ec7d118fba0df74c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_conversation_reads" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "sender_id" integer NOT NULL, "group_id" integer NOT NULL, "last_read_conversation_id" integer NOT NULL, CONSTRAINT "PK_3e48348296933b45318de742829" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "group_conversation_reads"`);
        await queryRunner.query(`DROP TABLE "single_conversation_reads"`);
    }

}
