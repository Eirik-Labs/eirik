import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRcaToIncident1787770486528 implements MigrationInterface {
    name = 'AddRcaToIncident1787770486528'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" ADD "rca" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "incidents" DROP COLUMN "rca"`);
    }

}
