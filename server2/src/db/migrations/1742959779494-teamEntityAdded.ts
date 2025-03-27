import { MigrationInterface, QueryRunner } from "typeorm";

export class TeamEntityAdded1742959779494 implements MigrationInterface {
    name = 'TeamEntityAdded1742959779494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "team" ("teamId" SERIAL NOT NULL, "teamName" character varying NOT NULL, "teamShortName" character varying NOT NULL, "totalBudget" integer NOT NULL, "balanceBudget" integer NOT NULL, "auctionAuctionId" integer, CONSTRAINT "PK_e3c1e347fd4f0813cc7b2e2115b" PRIMARY KEY ("teamId"))`);
        await queryRunner.query(`ALTER TABLE "team" ADD CONSTRAINT "FK_df56c38cfcba68b40291432973f" FOREIGN KEY ("auctionAuctionId") REFERENCES "auction"("auction_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team" DROP CONSTRAINT "FK_df56c38cfcba68b40291432973f"`);
        await queryRunner.query(`DROP TABLE "team"`);
    }

}
