import bcrypt from 'bcryptjs'
import { AppDataSource } from '../../../db/data-source';
import { User } from '../entities/User';

export const registerService = async (args: any) => {
    const { user_name, city, phone_number, email, password } = args
    const hashedPassword = await bcrypt.hash(password, 10)
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