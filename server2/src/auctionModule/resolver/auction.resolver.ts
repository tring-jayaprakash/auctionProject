import { createAuctionService } from "../service/createAuction.service"

export const resolver = {


    Mutation: {
        createAuctionByUserId: async (_parent: any, args: any, context: any) => {
            return createAuctionService(_parent, args, context)
        }
    }
}
