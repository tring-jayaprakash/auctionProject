import { MigrationInterface, QueryRunner } from "typeorm";

export class TeamEntityUpdated1743064773395 implements MigrationInterface {
    name = 'TeamEntityUpdated1743064773395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" ADD "auctionAuctionId" integer`);
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "PlayerPhoneNumber"`);
        await queryRunner.query(`ALTER TABLE "player" ADD "PlayerPhoneNumber" integer`);
        await queryRunner.query(`ALTER TABLE "player" ADD CONSTRAINT "FK_2245cb5eee2840772f48c551edf" FOREIGN KEY ("auctionAuctionId") REFERENCES "auction"("auction_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "player" DROP CONSTRAINT "FK_2245cb5eee2840772f48c551edf"`);
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "PlayerPhoneNumber"`);
        await queryRunner.query(`ALTER TABLE "player" ADD "PlayerPhoneNumber" character varying(15)`);
        await queryRunner.query(`ALTER TABLE "player" DROP COLUMN "auctionAuctionId"`);
    }

}
