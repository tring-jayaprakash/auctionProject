import { makeExtendSchemaPlugin } from "postgraphile";
import { schema } from "../schema/auction.schema";
import { resolver } from "../resolver/auction.resolver";

export const AuctionPlugin = makeExtendSchemaPlugin((build) => {
    return {
        typeDefs: schema,
        resolvers: resolver
    }
})