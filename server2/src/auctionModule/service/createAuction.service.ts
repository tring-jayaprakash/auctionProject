import { log } from "console";
import { AppDataSource } from "../../db/data-source";
import { Auction } from "../../entities/auction";
import { Status } from "../../entities/auction";
import { User } from "../../entities/User";

export const createAuctionService = async (_parent: any, args: any, context: any) => {
    if (!context.user) {
        throw new Error("Unauthorized");
    }

    // console.log(args);
    
    const creatorUserId = context.user.user_id; 
    console.log("User ID from Token:", creatorUserId);

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: { user_id: creatorUserId }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const { auctionName, date, time, baseBid, bidIncreaseBy, maxPlayer, minPlayer ,sportsType} = args;

    const auctionRepository = AppDataSource.getRepository(Auction);
    const newAuction = auctionRepository.create({
        auction_name: auctionName,
        date,
        time,
        sports_type:sportsType,
        base_bid: baseBid,
        bid_increase_by: bidIncreaseBy,
        max_player: maxPlayer,
        min_player: minPlayer,
        auction_status: Status.PENDING, 
        creator: user
    });
    await auctionRepository.save(newAuction);

    // return {
    //     auctionId: newAuction.auction_id,
    //     auctionName: newAuction.auction_name,
    //     date: newAuction.date,
    //     time: newAuction.time,
    //     baseBid: newAuction.base_bid,
    //     bidIncreaseBy: newAuction.bid_increase_by,
    //     maxPlayer: newAuction.max_player,
    //     minPlayer: newAuction.min_player,
    //     auctionStatus: newAuction.auction_status,
    //     creatorUserId: newAuction.creator.user_id,
    //     sportsType: newAuction.sports_type
    // };
    
    return "inserted sucessfully"
};
