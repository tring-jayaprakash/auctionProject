
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