import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Auction } from "./auction"; 

@Entity({ name: "user" }) 
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column()
  user_name!: string;

  @Column()
  city!: string;

  @Column()
  phone_number!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Auction, (auction) => auction.creator)
  auctions!: Auction[];
}
