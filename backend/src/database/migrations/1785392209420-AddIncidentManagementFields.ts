import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIncidentManagementFields1785392209420 implements MigrationInterface {
    name = 'AddIncidentManagementFields1785392209420'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" ADD "assignee" character varying`);
        await queryRunner.query(`ALTER TABLE "incidents" ADD "acknowledgedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "incidents" ADD "resolvedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "resolvedAt"`);
        await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "acknowledgedAt"`);
        await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "assignee"`);
    }

}
