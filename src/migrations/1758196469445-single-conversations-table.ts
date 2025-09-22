import { MigrationInterface, QueryRunner } from "typeorm";

export class SingleConversationsTable1758196469445 implements MigrationInterface {
    name = 'SingleConversationsTable1758196469445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_conversations" DROP CONSTRAINT "FK_7f120316d195ee7a173e695a326"`);
        await queryRunner.query(`ALTER TABLE "single_conversations" RENAME COLUMN "group_id" TO "receiver_id"`);
        await queryRunner.query(`ALTER TABLE "single_conversations" ADD CONSTRAINT "FK_1bdca0a52e498996d0f14725a3b" FOREIGN KEY ("receiver_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_conversations" DROP CONSTRAINT "FK_1bdca0a52e498996d0f14725a3b"`);
        await queryRunner.query(`ALTER TABLE "single_conversations" RENAME COLUMN "receiver_id" TO "group_id"`);
        await queryRunner.query(`ALTER TABLE "single_conversations" ADD CONSTRAINT "FK_7f120316d195ee7a173e695a326" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
