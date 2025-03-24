import { makeExtendSchemaPlugin, gql } from "postgraphile";
import { AppDataSource } from "../../db/data-source";
import { User } from "../../entities/User";
import jwt from "jsonwebtoken"
import { schema } from "../schema/user.schema";
import { resolver } from "../resolver/user.resolver";
const bcrypt = require('bcryptjs')

export const AuthPlugin = makeExtendSchemaPlugin((build) => {
    return {
        typeDefs: schema,
        resolvers: resolver
    }
})