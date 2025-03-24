import { makeExtendSchemaPlugin, gql } from "postgraphile";
import { AppDataSource } from "../../db/data-source";
import { User } from "../../entities/User";
import jwt from "jsonwebtoken"
const bcrypt = require('bcryptjs')

export const AuthPlugin = makeExtendSchemaPlugin((build) => {
    return {
        typeDefs: gql`
            extend type Query {
                getUserProfile: User
            }

            extend type Mutation{
                login(email:String!, password: String!) : String
                register(user_name:String!, city:String! ,phone_number:String! ,email:String! ,password:String!):String
            } 
        `,



        resolvers: {
            Query: {
                getUserProfile: async (_parent, _args, context) => {
                    if (!context.user) {
                        throw new Error("Unauthorized");
                    }

                    const userRepository = AppDataSource.getRepository(User);
                    const user = await userRepository.findOne({
                        where: { user_id: context.user.user_id },
                        select: ["user_id", "user_name", "city", "phone_number", "email"]
                    });
                    // console.log(user);
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
            },

            Mutation: {
                login: async (_parent, args) => {
                    const { email, password } = args
                    const userRepository = AppDataSource.getRepository(User)
                    const user = await userRepository.findOne({ where: { email: email } });
                    console.table(user);
                    if (!user) return "enter valid email"
                    const dehashPassword = await bcrypt.compare(password, user.password)
                    if (!dehashPassword) {
                        throw new Error("Invalid credentials");
                    }

                    const key = process.env.SECRET_KEY
                    const { user_id, user_name } = user;

                    const token = jwt.sign({ user_id, user_name }, key!, { expiresIn: "1d" })

                    console.log(token);

                    return token
                    // return {
                    //     token,
                    //     user
                    // };
                },
                register: async (_parent, args) => {
                    const { user_name, city, phone_number, email, password } = args
                    const hashedPassword = await bcrypt.hash(password, 10)
                    console.table(args);
                    console.table(hashedPassword);
                    const userRepository = AppDataSource.getRepository(User)
                    const user = await userRepository.create({
                        user_name,
                        city,
                        phone_number,
                        email,
                        password: hashedPassword
                    })
                    userRepository.save(user)
                    return "args geted sucessfully"
                }

            }

        }

    }
})