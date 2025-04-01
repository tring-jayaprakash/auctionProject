import { loginService } from "../service/login.service";
import { registerService } from "../service/register.service";
import { getUserProfileService } from "../service/getUserProfile.service";
import { getAuctionByUserService } from "../service/getAuctionByUser.service";

export const resolver = {
    Mutation: {
        login: async (_parent: any, args: any) => {
            return loginService(args)
        },
        register: async (_parent: any, args: any) => {
            return registerService(args)
        }
    }
}
