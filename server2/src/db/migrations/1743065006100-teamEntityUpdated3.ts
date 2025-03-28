import { MigrationInterface, QueryRunner } from "typeorm";

export class TeamEntityUpdated31743065006100 implements MigrationInterface {
    name = 'TeamEntityUpdated31743065006100'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "PlayerPhoneNumber"`);
        await queryRunner.query(`ALTER TABLE "player" ADD "PlayerPhoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "playerBidAmount"`);
        await queryRunner.query(`ALTER TABLE "player" ADD "playerBidAmount" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "playerBidAmount"`);
        await queryRunner.query(`ALTER TABLE "player" ADD "playerBidAmount" character varying`);
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "PlayerPhoneNumber"`);
        await queryRunner.query(`ALTER TABLE "player" ADD "PlayerPhoneNumber" integer`);
    }

}
