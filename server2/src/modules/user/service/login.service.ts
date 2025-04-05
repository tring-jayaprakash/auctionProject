import { AppDataSource } from "../../../db/data-source";
import { User } from "../entities/User";
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs'

export const loginService = async (args: any) => {
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
}