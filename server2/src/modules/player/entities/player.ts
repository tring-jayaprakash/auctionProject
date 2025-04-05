import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AuctionPlayer } from "../../auction/entities/auctionPlayer";
import { Auction } from "../../auction/entities/auction";

@Entity()
export class Player {
    @PrimaryGeneratedColumn()
    playerId: number;

    @Column()
    playerName: string;

    @Column({ nullable: true })
    PlayerPhoneNumber: string;

    @Column({ nullable: true })
    playerAge: number;

    @Column({ nullable: true })
    playerStyle: string

    @Column({ nullable: true })
    playerBidAmount: number;

    @OneToMany(() => AuctionPlayer, (auctionPlayer) => auctionPlayer.player)
    auctionPlayers: AuctionPlayer[];

    @ManyToOne(() => Auction, (auction) => auction.teams, { onDelete: "CASCADE" })
    auction: Auction;
}