import { MigrationInterface, QueryRunner } from "typeorm";

export class FileEntity1762199149717 implements MigrationInterface {
    name = 'FileEntity1762199149717'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."files_association_type_enum" AS ENUM('profile', 'group')`);
        await queryRunner.query(`CREATE TABLE "files" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "path" character varying, "filename" character varying NOT NULL, "association_id" integer, "association_type" "public"."files_association_type_enum", CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TYPE "public"."files_association_type_enum"`);
    }

}
