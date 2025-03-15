    const { buildSchema } = require('graphql')


    const schema = buildSchema(
        `
        type user{
            user_id:ID
            city:String
            ph_number:String
            user_name:String
            email:String
            password:String
        }

        type Auction {
            auction_id: ID!
            logo: String
            sports: String!
            auction_name: String!
            date: String!
            time: String!
            base_bit: Int!
            bit_increse_by: Int!
            max_player: Int
            min_player: Int
            user_id: Int
            auction_status:String
        }

        type Team {
            team_id: ID!
            team_logo: String
            team_name: String!
            team_short_name: String!
            auction_id: Int
            budget:Int
            total_budget:Int
        }

        type player
        {
            player_id : ID 
            player_pic : String
            player_name : String
            father_name : String
            player_ph_number : String
            age : String
            form_number: String
            player_style : String
            team_id : String
            auction_id : Int
        }

        type Query {
            getUser:[user]
            login(email:String!,password:String!):user
            getAuction:[Auction]
            getTeams: [Team]
            getAuctionByauction_id(auction_id:Int!):[Auction]
            getAuctionByUserId(user_id:Int!):[Auction]
            getTeamsByAuction(auction_id: Int!): [Team]
            getPlayers:[player]
            getPlayersByAuction(auction_id: Int!):[player]
            getPlayersByAuctionTeamNull(auction_id: Int!):[player]
            getPlayersByTeam(team_id:ID!):[player]
        }


        type Mutation{
            register(city:String!,ph_number:String!,user_name:String!,email:String!,password:String!):String
            addAuction(  logo: String,   sports: String!,   auction_name: String!,   date: String!,   time: String!,   base_bit: Int!,   bit_increse_by: Int!,   max_player: Int,   min_player: Int,   user_id: Int ): String
            updateAuction( auction_id: ID!, logo: String, sports: String, auction_name: String, date: String, time: String, base_bit: Int, bit_increse_by: Int, max_player: Int, min_player: Int ): String
            updateAuctionStatus(auction_id: ID!,auction_status:String!):String

            deleteAuction(auction_id: ID!): String
            addTeam(team_logo: String, team_name: String!, team_short_name: String!, auction_id: Int): Team
            updateTeam(team_id: ID!, team_logo: String, team_name: String, team_short_name: String, auction_id: Int): Team
            deleteTeam(team_id: ID!): String
            addPlayer( player_pic : String ,player_name : String! ,father_name : String ,player_ph_number : String ,age : String ,form_number: String! ,player_style : String ,team_id : String ,auction_id: Int):player
            updatePlayer(player_id: Int! ,player_pic: String ,player_name: String ,father_name: String ,player_ph_number: String ,age: String ,form_number: String ,player_style: String ,team_id: Int ): player
            deletePlayer(player_id: Int!): String
            updatePlayerForTeam(player_id: Int! ,team_id :Int ,bid_amount:Int):String
            updateTeamBudget(auction_id:Int! , budget : Int! , total_budget :Int):String

            updateTeamBudgetByTeamId(team_id:Int! , budget : Int!):String
            

            }   
            `
    )


    module.exports = schema