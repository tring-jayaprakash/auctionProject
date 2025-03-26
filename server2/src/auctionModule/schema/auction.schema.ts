import { gql } from "postgraphile";

export const schema =
    gql`
        extend type Mutation{
             createAuctionByUserId( auctionName: String!, date: Date!, time: Time!, baseBid: Int!, bidIncreaseBy: Int!, maxPlayer: Int!, minPlayer: Int! ,sportsType:String!): String
            }
            `
            
            // createAuctionByUserId( auctionName: String!, date: Date!, time: Time!, baseBid: Int!, bidIncreaseBy: Int!, maxPlayer: Int!, minPlayer: Int! ,sportsType:String!): Auction!
            // createAuction(email:String,password:String):String

        // extend type Query {
    
        // }