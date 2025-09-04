import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersGroupsTable1757015625690 implements MigrationInterface {
  name = 'UsersGroupsTable1757015625690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP CONSTRAINT "FK_d8a1834cee7d6347016e3e55f04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP CONSTRAINT "FK_7fff02b7fb30cd3730d90693dec"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d8a1834cee7d6347016e3e55f0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7fff02b7fb30cd3730d90693de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP CONSTRAINT "PK_0dcbb207a5f954c29bfcf7a3921"`,
    );
    // await queryRunner.query(`ALTER TABLE "groups_users" ADD CONSTRAINT "PK_d8a1834cee7d6347016e3e55f04" PRIMARY KEY ("group_id")`);
    await queryRunner.query(`ALTER TABLE "groups_users" DROP COLUMN "user_id"`);
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD "id" SERIAL NOT NULL`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "groups_users" DROP CONSTRAINT "PK_d8a1834cee7d6347016e3e55f04"`,
    // );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD CONSTRAINT "PK_f4e859fe59ed79c2d7ef4e27710" PRIMARY KEY ("group_id", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD "deleted_at" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD "member_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ALTER COLUMN "name" SET DEFAULT 'my group'`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP CONSTRAINT "PK_f4e859fe59ed79c2d7ef4e27710"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD CONSTRAINT "PK_0522408450b64f57950fd876654" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD CONSTRAINT "FK_1d26452f47bb5f3b90b68f2c5e7" FOREIGN KEY ("member_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD CONSTRAINT "FK_d8a1834cee7d6347016e3e55f04" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP CONSTRAINT "FK_d8a1834cee7d6347016e3e55f04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP CONSTRAINT "FK_1d26452f47bb5f3b90b68f2c5e7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP CONSTRAINT "PK_0522408450b64f57950fd876654"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD CONSTRAINT "PK_f4e859fe59ed79c2d7ef4e27710" PRIMARY KEY ("group_id", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups" ALTER COLUMN "name" SET DEFAULT 'my_group'`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP COLUMN "member_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP COLUMN "deleted_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" DROP CONSTRAINT "PK_f4e859fe59ed79c2d7ef4e27710"`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "groups_users" ADD CONSTRAINT "PK_d8a1834cee7d6347016e3e55f04" PRIMARY KEY ("group_id")`,
    // );
    await queryRunner.query(`ALTER TABLE "groups_users" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD "user_id" integer NOT NULL`,
    );
    // await queryRunner.query(
    //   `ALTER TABLE "groups_users" DROP CONSTRAINT "PK_d8a1834cee7d6347016e3e55f04"`,
    // );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD CONSTRAINT "PK_0dcbb207a5f954c29bfcf7a3921" PRIMARY KEY ("group_id", "user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7fff02b7fb30cd3730d90693de" ON "groups_users" ("user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d8a1834cee7d6347016e3e55f0" ON "groups_users" ("group_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD CONSTRAINT "FK_7fff02b7fb30cd3730d90693dec" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "groups_users" ADD CONSTRAINT "FK_d8a1834cee7d6347016e3e55f04" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
