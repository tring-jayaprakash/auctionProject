import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AuctionPlayer } from "./auctionPlayer";

@Entity()
export  class Player{
    @PrimaryGeneratedColumn()
    playerId:number;

    @Column()
    playerName:string;

    @Column()
    PlayerPhoneNumber:number;

    @Column()
    playerAge:number;

    @Column()
    playerStyle:string

    @Column()
    playerBidAmount:number;

    @OneToMany(() => AuctionPlayer, (auctionPlayer) => auctionPlayer.player)
    auctionPlayers: AuctionPlayer[];
}