import { AppDataSource } from "../../db/data-source";
import { Auction } from "../../entities/auction";
import { User } from "../../entities/User";

export const getAuctionByUserService = async (_parent: any, _args: any, context: any) => {
    if (!context.user) {
        throw new Error("Unauthorized");
    }

    console.log("User ID from Token:", context.user.user_id);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: { user_id: context.user.user_id },
        select: ["user_id", "user_name", "city", "phone_number", "email"]
    });
    
    if (!user) {
        throw new Error("User not found");
    }

    const auctionRepository = AppDataSource.getRepository(Auction);
    const auctions = await auctionRepository.find({
        where: { creator: { user_id: context.user.user_id } },
        relations: ["creator"],
    });

    return auctions.map(a => ({
        auctionId: a.auction_id,
        auctionName: a.auction_name,
        date: a.date,
        time: a.time,
        baseBid: a.base_bid,
        bidIncreaseBy: a.bid_increase_by,
        maxPlayer: a.max_player,
        minPlayer: a.min_player,
        auctionStatus: a.auction_status,
        sportsType:a.sports_type,
        creatorUserId: a.creator.user_id
    }));
};
