import { MigrationInterface, QueryRunner } from "typeorm";

export class SingleConversationsConstraint1758262782849 implements MigrationInterface {
    name = 'SingleConversationsConstraint1758262782849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_conversations" DROP CONSTRAINT "FK_1bdca0a52e498996d0f14725a3b"`);
        await queryRunner.query(`ALTER TABLE "single_conversations" ADD CONSTRAINT "FK_1bdca0a52e498996d0f14725a3b" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "single_conversations" DROP CONSTRAINT "FK_1bdca0a52e498996d0f14725a3b"`);
        await queryRunner.query(`ALTER TABLE "single_conversations" ADD CONSTRAINT "FK_1bdca0a52e498996d0f14725a3b" FOREIGN KEY ("receiver_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
