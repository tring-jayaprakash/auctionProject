import { makeExtendSchemaPlugin } from "postgraphile";
import { schema } from "../schema/user.schema";
import { resolver } from "../resolver/user.resolver";

export const AuthPlugin = makeExtendSchemaPlugin((build) => {
    return {
        typeDefs: schema,
        resolvers: resolver
    }
})
