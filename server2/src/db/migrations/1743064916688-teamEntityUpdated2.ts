import { MigrationInterface, QueryRunner } from "typeorm";

export class TeamEntityUpdated21743064916688 implements MigrationInterface {
    name = 'TeamEntityUpdated21743064916688'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "playerBidAmount"`);
        await queryRunner.query(`ALTER TABLE "player" ADD "playerBidAmount" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "playerBidAmount"`);
        await queryRunner.query(`ALTER TABLE "player" ADD "playerBidAmount" integer`);
    }

}
