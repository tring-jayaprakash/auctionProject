import { loginService } from "../service/login.service";
import { registerService } from "../service/register.service";

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
