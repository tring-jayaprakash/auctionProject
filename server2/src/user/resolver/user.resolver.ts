import { AppDataSource } from "../../db/data-source";
import { User } from "../../entities/User";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import { loginService } from "../service/login.service";
import { registerService } from "../service/register.service";
import { getUserProfileService } from "../service/getUserProfile.service";

export const resolver = {
    Query: {
        getUserProfile: async (_parent: any, _args: any, context: any) => {
            // if (!context.user) {
            //     throw new Error("Unauthorized");
            // }

            // const userRepository = AppDataSource.getRepository(User);
            // const user = await userRepository.findOne({
            //     where: { user_id: context.user.user_id },
            //     select: ["user_id", "user_name", "city", "phone_number", "email"]
            // });
            // // console.log(user);
            // if (!user) {
            //     throw new Error("User not found");
            // }
            // return {
            //     email: user.email,
            //     userName: user.user_name,
            //     city: user.city,
            //     phoneNumber: user.phone_number,
            //     userId: user.user_id
            // };
           return getUserProfileService(_parent, _args, context)
        }
    },
    Mutation: {
        login: async (_parent: any, args: any) => {
            // const { email, password } = args
            // const userRepository = AppDataSource.getRepository(User)
            // const user = await userRepository.findOne({ where: { email: email } });
            // console.table(user);
            // if (!user) return "enter valid email"
            // const dehashPassword = await bcrypt.compare(password, user.password)
            // if (!dehashPassword) {
            //     throw new Error("Invalid credentials");
            // }

            // const key = process.env.SECRET_KEY
            // const { user_id, user_name } = user;

            // const token = jwt.sign({ user_id, user_name }, key!, { expiresIn: "1d" })

            // console.log(token);

            // return token
            // return {
            //     token,
            //     user
            // };
            return loginService(args)
        },
        register: async (_parent: any, args: any) => {
            // const { user_name, city, phone_number, email, password } = args
            // const hashedPassword = await bcrypt.hash(password, 10)
            // console.table(args);
            // console.table(hashedPassword);
            // const userRepository = AppDataSource.getRepository(User)
            // const user = await userRepository.create({
            //     user_name,
            //     city,
            //     phone_number,
            //     email,
            //     password: hashedPassword
            // })
            // userRepository.save(user)
            // return "args geted sucessfully"
            return registerService(args)
        }
    }
}

