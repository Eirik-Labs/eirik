import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIncidentStatusEnumForAcknowledged1785394996106 implements MigrationInterface {
    name = 'AddIncidentStatusEnumForAcknowledged1785394996106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."incidents_status_enum" RENAME TO "incidents_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."incidents_status_enum" AS ENUM('open', 'investigating', 'resolved', 'closed', 'acknowledged')`);
        await queryRunner.query(`ALTER TABLE "incidents" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "incidents" ALTER COLUMN "status" TYPE "public"."incidents_status_enum" USING "status"::"text"::"public"."incidents_status_enum"`);
        await queryRunner.query(`ALTER TABLE "incidents" ALTER COLUMN "status" SET DEFAULT 'open'`);
        await queryRunner.query(`DROP TYPE "public"."incidents_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."incidents_status_enum_old" AS ENUM('open', 'investigating', 'resolved', 'closed')`);
        await queryRunner.query(`ALTER TABLE "incidents" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "incidents" ALTER COLUMN "status" TYPE "public"."incidents_status_enum_old" USING "status"::"text"::"public"."incidents_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "incidents" ALTER COLUMN "status" SET DEFAULT 'open'`);
        await queryRunner.query(`DROP TYPE "public"."incidents_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."incidents_status_enum_old" RENAME TO "incidents_status_enum"`);
    }

}
