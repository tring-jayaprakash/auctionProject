import { MigrationInterface, QueryRunner } from "typeorm";

export class TeamEntityAdded1743046658111 implements MigrationInterface {
    name = 'TeamEntityAdded1743046658111'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "player" ("playerId" SERIAL NOT NULL, "playerName" character varying NOT NULL, "PlayerPhoneNumber" integer, "playerAge" integer, "playerStyle" character varying, "playerBidAmount" integer, CONSTRAINT "PK_ee365af3f201a00d9a917bc45b0" PRIMARY KEY ("playerId"))`);
        await queryRunner.query(`CREATE TABLE "auction_player" ("AuctionPlayerId" SERIAL NOT NULL, "bid_amount" integer NOT NULL, "playerPlayerId" integer, "teamTeamId" integer, "auctionAuctionId" integer, CONSTRAINT "PK_2b6da019adbe04b053a114d99c0" PRIMARY KEY ("AuctionPlayerId"))`);
        await queryRunner.query(`ALTER TABLE "auction_player" ADD CONSTRAINT "FK_56644eb3e3cc83ec95e26ef1023" FOREIGN KEY ("playerPlayerId") REFERENCES "player"("playerId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auction_player" ADD CONSTRAINT "FK_aa66223237061761139296d3c26" FOREIGN KEY ("teamTeamId") REFERENCES "team"("teamId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "auction_player" ADD CONSTRAINT "FK_604dace1a6c9599ebe252179c13" FOREIGN KEY ("auctionAuctionId") REFERENCES "auction"("auction_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction_player" DROP CONSTRAINT "FK_604dace1a6c9599ebe252179c13"`);
        await queryRunner.query(`ALTER TABLE "auction_player" DROP CONSTRAINT "FK_aa66223237061761139296d3c26"`);
        await queryRunner.query(`ALTER TABLE "auction_player" DROP CONSTRAINT "FK_56644eb3e3cc83ec95e26ef1023"`);
        await queryRunner.query(`DROP TABLE "auction_player"`);
        await queryRunner.query(`DROP TABLE "player"`);
    }

}
