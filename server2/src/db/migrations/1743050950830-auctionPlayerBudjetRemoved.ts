import { MigrationInterface, QueryRunner } from "typeorm";

export class AuctionPlayerBudjetRemoved1743050950830 implements MigrationInterface {
    name = 'AuctionPlayerBudjetRemoved1743050950830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction_player" DROP COLUMN "bid_amount"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction_player" ADD "bid_amount" integer NOT NULL`);
    }

}
