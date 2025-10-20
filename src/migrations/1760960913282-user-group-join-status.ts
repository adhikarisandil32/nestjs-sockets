import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserGroupJoinStatus1760960913282 implements MigrationInterface {
  name = 'UserGroupJoinStatus1760960913282';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_groups_join_status_enum" AS ENUM('approved', 'rejected', 'pending')`,
    );
    await queryRunner.query(
      `ALTER TABLE "users_groups" ADD "join_status" "public"."users_groups_join_status_enum" NOT NULL`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "users_groups" ADD CONSTRAINT "UQ_8bc894be6cf4f6d60a458219c2e" UNIQUE ("member_id", "group_id")`,
    // );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE "users_groups" DROP CONSTRAINT "UQ_8bc894be6cf4f6d60a458219c2e"`,
    // );
    await queryRunner.query(
      `ALTER TABLE "users_groups" DROP COLUMN "join_status"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."users_groups_join_status_enum"`,
    );
  }
}
