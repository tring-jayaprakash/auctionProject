import { AppDataSource } from "../../db/data-source";
import { User } from "../../entities/User";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import { loginService } from "../service/login.service";
import { registerService } from "../service/register.service";
import { getUserProfileService } from "../service/getUserProfile.service";
import { getAuctionByUserService } from "../service/getAuctionByUser.service";

export const resolver = {
    Query: {
        getUserProfile: async (_parent: any, _args: any, context: any) => {
            return getUserProfileService(_parent, _args, context)
        },
        getAuctionByUser: async (_parent: any, _args: any, context: any) => {
            return getAuctionByUserService(_parent, _args, context)
        }
    },
    Mutation: {
        login: async (_parent: any, args: any) => {
            return loginService(args)
        },
        register: async (_parent: any, args: any) => {
            return registerService(args)
        }

    }
}

