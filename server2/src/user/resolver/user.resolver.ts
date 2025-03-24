import { AppDataSource } from "../../db/data-source";
import { User } from "../../entities/User";
import bcrypt from 'bcryptjs'


export const resolver = {
    resolvers: {
        Mutation: {
            login: async (_parent:any, args:any) => {
                const { email, password } = args
                console.log(args);

                const userRepository = AppDataSource.getRepository(User)

                const user = await userRepository.findOne({ where: { email } });
                console.log("-------------->user  ", user);
                return "user logged successfuly"
            },
            register: async (_parent:any, args:any) => {
                const { user_name, city, phone_number, email, password } = args
                const hashedPassword = await bcrypt.hash(password, 10)
                console.table(args);
                console.table(hashedPassword);
                const userRepository = AppDataSource.getRepository(User)
                const user = await userRepository.insert({
                    user_name,
                    city,
                    phone_number,
                    email,
                    password
                })

                return "args geted sucessfully"
            }

        }

    }
}