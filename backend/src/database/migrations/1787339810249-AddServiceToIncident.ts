import { MigrationInterface, QueryRunner } from "typeorm";

export class AddServiceToIncident1787339810249 implements MigrationInterface {
    name = 'AddServiceToIncident1787339810249'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" ADD "service" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "service"`);
    }

}
