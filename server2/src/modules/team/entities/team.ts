import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Auction } from "../../auction/entities/auction";
import { AuctionPlayer } from "../../auction/entities/auctionPlayer";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  teamId: number;

  @Column()
  teamName: string;

  @Column()
  teamShortName: string;

  @Column({nullable:true})
  totalBudget: number;

  @Column({nullable:true})
  balanceBudget: number;

  @ManyToOne(() => Auction, (auction) => auction.teams, { onDelete: "CASCADE" })
  auction: Auction;

  @OneToMany(() => AuctionPlayer, (auctionPlayer) => auctionPlayer.team)
  auctionPlayers: AuctionPlayer[];
}





