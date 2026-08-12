import { MigrationInterface, QueryRunner } from "typeorm";

export class AddWebhookSecretToOrganizations1786388745509 implements MigrationInterface {
    name = 'AddWebhookSecretToOrganizations1786388745509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" ADD "webhookSecret" character varying`);
        await queryRunner.query(`ALTER TABLE "organizations" ADD CONSTRAINT "UQ_24fa5cbe1716fc3488f2ada77c1" UNIQUE ("webhookSecret")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organizations" DROP CONSTRAINT "UQ_24fa5cbe1716fc3488f2ada77c1"`);
        await queryRunner.query(`ALTER TABLE "organizations" DROP COLUMN "webhookSecret"`);
    }

}
