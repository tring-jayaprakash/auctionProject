
import { gql } from "@apollo/client";

export const GET_AUCTION_BY_USER = gql`
    query {
        getAuctionByUser {
            auctionId
            auctionName
            date
            time
            baseBid
            bidIncreaseBy
            maxPlayer
            minPlayer
            auctionStatus
            creatorUserId
        }
    }
`;



export const LOGIN_USER_QUERY = `
    query LoginUser( $email: String!, $password: String! ) 
    {
        login( email: $email, password: $password ) 
        {
            user_id
            user_name
            email
            ph_number
            city
        }
    }
`;


export const GET_AUCTION_BY_USER_ID = `
    query GetAuctionByUserId($user_id: Int!) {
        getAuctionByUserId(user_id: $user_id) {
            auction_id
            logo
            sports
            auction_name
            date
            time
            base_bit
            bit_increse_by
            max_player
            min_player
            user_id
            auction_status
        }
    }
`;


export const GET_TEAM_BY_AUCTION_ID = `
         query GetTeamsByAuction($auction_id: ID!)
        {
            getTeamsByAuction(auction_id: $auction_id) 
            {
                team_id
                team_logo
                team_name
                team_short_name
                auction_id
            }
        }  
` 

export const GET_PLAYERS_BY_AUCTION = `
    query GetPlayersByAuction($auction_id: Int!) {
        getPlayersByAuction(auction_id: $auction_id) {
            player_id
            player_pic
            player_name
            father_name
            player_ph_number
            age
            form_number
            player_style
            team_id
        }
    }
`;
