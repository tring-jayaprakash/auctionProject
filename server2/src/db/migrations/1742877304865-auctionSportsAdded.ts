import { MigrationInterface, QueryRunner } from "typeorm";

export class AuctionSportsAdded1742877304865 implements MigrationInterface {
    name = 'AuctionSportsAdded1742877304865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction" ADD "sports_type" character varying`);

        await queryRunner.query(`UPDATE "auction" SET "sports_type" = 'default_sport' WHERE "sports_type" IS NULL`);

        await queryRunner.query(`ALTER TABLE "auction" ALTER COLUMN "sports_type" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction" DROP COLUMN "sports_type"`);
    }
}
