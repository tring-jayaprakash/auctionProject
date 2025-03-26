// import { loginService } from "../service/login.service";
// import { registerService } from "../service/register.service";
// import { getUserProfileService } from "../service/getUserProfile.service";
// import { getAuctionByUserService } from "../service/getAuctionByUser.service";

import { createAuctionService } from "../service/createAuction.service"

export const resolver = {
    // Query: {
        // getUserProfile: async (_parent: any, _args: any, context: any) => {
        //     return getUserProfileService(_parent, _args, context)
        // },
        // getAuctionByUser: async (_parent: any, _args: any, context: any) => {
        //     return getAuctionByUserService(_parent, _args, context)
        // }
    // },
    
    Mutation: {
        // createAuctionByUserId: async (_parent: any, args: any, context: any) => {
        //     return createAuctionService(_parent, args, context)
        
        // },
        
        createAuctionByUserId:async(_parent:any,args:any,context: any)=>{
                return createAuctionService(_parent, args, context)

        }
            
        // }
        // register: async (_parent: any, args: any) => {
            // return registerService(args)
        // }
    }
}
