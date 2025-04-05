import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "../../user/entities/User";
import { Team } from "../../team/entities/team"; 

export  enum Status {
    PENDING = "pending",
    COMPLETED = "completed"
}

@Entity()
export class Auction {
    @PrimaryGeneratedColumn()
    auction_id!: number;

    @Column()
    auction_name!: string;

    @Column()
    sports_type!:string;

    @Column({ type: "date" })
    date!: Date;

    @Column({ type: "time" })
    time!: string; 

    @Column()
    base_bid!: number; 

    @Column()
    bid_increase_by!: number; 

    @Column()
    max_player!: number;

    @Column()
    min_player!: number;

    @Column({ type: "enum", enum: Status })
    auction_status!: Status;

    @ManyToOne(() => User, (user) => user.auctions,{onDelete:"CASCADE"})
    creator!: User; 

    @OneToMany(() => Team, (team) => team.auction)
    teams!: Team[];
}
