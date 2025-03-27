import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Player } from "./player";
import { Team } from "./team";
import { Auction } from "./auction";

@Entity()
export class AuctionPlayer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Player, (player) => player.auctionPlayers, { onDelete: "CASCADE" })
    player: Player;

    @ManyToOne(() => Team, (team) => team.auctionPlayers, { onDelete: "CASCADE" })
    team: Team;

    @ManyToOne(() => Auction, (auction) => auction.teams, { onDelete: "CASCADE" })
    auction: Auction;

    @Column()
    bid_amount: number;
}
