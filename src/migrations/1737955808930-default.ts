import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1737955808930 implements MigrationInterface {
    name = 'Default1737955808930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "requirements"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "contractType"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "salary"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "seniority"`);
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "isActive" character varying NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "applications" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "seniority" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "salary" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "contractType" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "requirements" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "description" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "applications" ADD "title" character varying(100) NOT NULL`);
    }

}
