import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Player } from "../../player/entities/player";
import { Team } from "../../team/entities/team";
import { Auction } from "../../auction/entities/auction";

@Entity()
export class AuctionPlayer {
    @PrimaryGeneratedColumn()
    AuctionPlayerId: number;

    @ManyToOne(() => Player, (player) => player.auctionPlayers, { onDelete: "CASCADE" })
    player: Player;

    @ManyToOne(() => Team, (team) => team.auctionPlayers, { onDelete: "CASCADE" })
    team: Team;

    @ManyToOne(() => Auction, (auction) => auction.teams, { onDelete: "CASCADE" })
    auction: Auction;
}
