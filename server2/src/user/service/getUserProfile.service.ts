import { AppDataSource } from "../../db/data-source";
import { User } from "../../entities/User";

export const getUserProfileService = async (_parent: any, _args: any, context: any) => {
    if (!context.user) {
        throw new Error("Unauthorized");
    }

    // console.log(context);
    
    console.log(_args);
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
        where: { user_id: context.user.user_id },
        select: ["user_id", "user_name", "city", "phone_number", "email"]
    });
    console.log(user);
    
    if (!user) {
        throw new Error("User not found");
    }
    return {
        email: user.email,
        userName: user.user_name,
        city: user.city,
        phoneNumber: user.phone_number,
        userId: user.user_id
    };
} 