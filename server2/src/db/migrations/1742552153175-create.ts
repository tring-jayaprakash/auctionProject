import { MigrationInterface, QueryRunner } from "typeorm";

export class Create1742552153175 implements MigrationInterface {
    name = 'Create1742552153175'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."auction_auction_status_enum" AS ENUM('pending', 'completed')`);
        await queryRunner.query(`CREATE TABLE "auction" ("auction_id" SERIAL NOT NULL, "auction_name" character varying NOT NULL, "date" date NOT NULL, "time" TIME NOT NULL, "base_bid" integer NOT NULL, "bid_increase_by" integer NOT NULL, "max_player" integer NOT NULL, "min_player" integer NOT NULL, "auction_status" "public"."auction_auction_status_enum" NOT NULL, "creatorUserId" integer, CONSTRAINT "PK_44f7425a2403f5c4386cd125e28" PRIMARY KEY ("auction_id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("user_id" SERIAL NOT NULL, "user_name" character varying NOT NULL, "city" character varying NOT NULL, "phone_number" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id"))`);
        await queryRunner.query(`ALTER TABLE "auction" ADD CONSTRAINT "FK_73e638ce7d1a987ee83fc1b8305" FOREIGN KEY ("creatorUserId") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "auction" DROP CONSTRAINT "FK_73e638ce7d1a987ee83fc1b8305"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "auction"`);
        await queryRunner.query(`DROP TYPE "public"."auction_auction_status_enum"`);
    }

}
