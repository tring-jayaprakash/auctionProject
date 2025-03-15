export const ADD_AUCTION_MUTATION = `
    mutation AddAuction( 
  $logo: String!, 
  $sports: String!, 
  $auction_name: String!, 
  $date: String!, 
  $time: String!, 
  $base_bit: Int!, 
  $bit_increse_by: Int!, 
  $max_player: Int!, 
  $min_player: Int!, 
  $user_id: Int!
) {
  addAuction( 
    logo: $logo, 
    sports: $sports, 
    auction_name: $auction_name, 
    date: $date, 
    time: $time, 
    base_bit: $base_bit, 
    bit_increse_by: $bit_increse_by, 
    max_player: $max_player, 
    min_player: $min_player, 
    user_id: $user_id 
  )
}
`;

export const UPDATE_AUCTION_MUTATION = `
    mutation UpdateAuction( $auction_id: ID!, $logo: String!, $sports: String!, $auction_name: String!, $date: String!, $time: String!, $base_bit: Int!, $bit_increse_by: Int!, $max_player: Int!, $min_player: Int! ) 
    {
        updateAuction( auction_id: $auction_id, logo: $logo, sports: $sports, auction_name: $auction_name, date: $date, time: $time, base_bit: $base_bit, bit_increse_by: $bit_increse_by, max_player: $max_player, min_player: $min_player)
    }
`;

export const REGISTER_USER_MUTATION = `
    mutation RegisterUser( $city: String!, $ph_number: String!, $user_name: String!, $email: String!, $password: String!) 
    {
        register(city: $city,ph_number: $ph_number,user_name: $user_name,email: $email,password: $password)
    }
`;


export const DELETE_AUCTION = `
    mutation DeleteAuction($auction_id: ID!) {
        deleteAuction(auction_id: $auction_id)
    }
`;
