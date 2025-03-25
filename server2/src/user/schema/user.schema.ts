import { gql } from "postgraphile";

export const schema =
    gql`



            extend type Query {
                getUserProfile: User
                getAuctionByUser:[Auction]
            }

            extend type Mutation{
                login(email:String!, password: String!) : String
                register(user_name:String!, city:String! ,phone_number:String! ,email:String! ,password:String!):String
            } 
        `
