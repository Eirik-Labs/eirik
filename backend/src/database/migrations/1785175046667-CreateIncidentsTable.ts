import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIncidentsTable1785175046667 implements MigrationInterface {
    name = 'CreateIncidentsTable1785175046667'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "incidents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fingerprint" character varying NOT NULL, "title" character varying NOT NULL, "status" "public"."incidents_status_enum" NOT NULL DEFAULT 'open', "source" "public"."incidents_source_enum" NOT NULL, "severity" "public"."incidents_severity_enum" NOT NULL, "alertCount" integer NOT NULL DEFAULT '1', "firstSeenAt" TIMESTAMP WITH TIME ZONE NOT NULL, "lastSeenAt" TIMESTAMP WITH TIME ZONE NOT NULL, "rawPayload" jsonb NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ccb34c01719889017e2246469f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4f9f4b339e624ef6637d4f1c2b" ON "incidents" ("fingerprint") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_4f9f4b339e624ef6637d4f1c2b"`);
        await queryRunner.query(`DROP TABLE "incidents"`);
    }

}
