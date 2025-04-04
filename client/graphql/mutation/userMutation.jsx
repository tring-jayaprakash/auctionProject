import { gql } from "@apollo/client";

// REGISTER 
export const REGISTER_USER = gql`
mutation guest($city: String = "", $email: String = "", $password: String = "", $phone_number: String = "", $user_name: String = "") {
    register(
    city: $city
    email: $email
    password: $password
    phone_number: $phone_number
    user_name: $user_name
    )
}
`
// LOGIN
export const LOGIN_USER = gql`
mutation guest($email: String = "", $password: String = "") {
    login(email: $email, password: $password)
}
`
export const CREATE_AUCTION_MUTATION = gql`
mutation MyMutation($auctionName: String = "", $baseBid: Int = 0, $bidIncreaseBy: Int = 0, $date: Date = "", $maxPlayer: Int = 0, $minPlayer: Int = 0, $sportsType: String = "", $time: Time = "") {
  createAuctionByUserId(
    baseBid: $baseBid
    bidIncreaseBy: $bidIncreaseBy
    date: $date
    maxPlayer: $maxPlayer
    minPlayer: $minPlayer
    sportsType: $sportsType
    time: $time
    auctionName: $auctionName
  )
}
`
export const UPDATE_AUCTION_MUTATION = gql`
mutation UpdateAuction(
  $auctionId: Int!
  $auctionName: String!
  $baseBid: Int!
  $bidIncreaseBy: Int!
  $date: Date!
  $maxPlayer: Int!
  $minPlayer: Int!
  $sportsType: String!
  $time: Time!
) {
  updateAuctionByAuctionId(
    input: {
      auctionPatch: {
        auctionName: $auctionName
        baseBid: $baseBid
        bidIncreaseBy: $bidIncreaseBy
        date: $date
        maxPlayer: $maxPlayer
        minPlayer: $minPlayer
        sportsType: $sportsType
        time: $time
      }
      auctionId: $auctionId
    }
  ) {
    auction {
      auctionId
      auctionName
      date
      time
      baseBid
      bidIncreaseBy
      maxPlayer
      minPlayer
      auctionStatus
      sportsType
    }
  }
}
`;

// MY AUCTION
export const FETCH_AUCTION_BY_USER_ID = gql`
query user($creatorUserId: Int!) {
  allAuctions(condition: {creatorUserId: $creatorUserId}) {
    edges {
      node {
        creatorUserId
        auctionId
        auctionName
        auctionStatus
        baseBid
        bidIncreaseBy
        date
        maxPlayer
        minPlayer
        sportsType
        time
      }
    }
  }
}
`
export const DELETE_AUCTION = gql`
mutation MyMutation($auctionId: Int = 0)  {
  deleteAuctionByAuctionId(input: {auctionId: $auctionId}) {
    auction {
      auctionId
      auctionName
      auctionStatus
      baseBid
      bidIncreaseBy
      creatorUserId
      date
      maxPlayer
      minPlayer
      nodeId
      sportsType
      time
    }
  }
}
`
export const UPDATE_TEAM_TOTAL_BUDGET = gql`
mutation UpdateTeamByTeamId($teamId: Int!, $budget: Int!, $balanceBudget: Int = 0) {
  updateTeamByTeamId(
    input: {teamId: $teamId, teamPatch: {totalBudget: $budget, balanceBudget: $balanceBudget}}
  ) {
    team {
      teamId
      teamName
      teamShortName
      totalBudget
    }
  }
}
`
// TEAMS
export const CREATE_TEAM = gql`
mutation CreateTeam($auctionAuctionId: Int!, $teamName: String!, $teamShortName: String!) {
  createTeam(
    input: { team: { teamName: $teamName, teamShortName: $teamShortName, auctionAuctionId: $auctionAuctionId } }
  ) {
    team {
      teamId
      teamName
      teamShortName
      auctionAuctionId
    }
  }
}
`
export const UPDATE_TEAM = gql`
mutation MyMutation($teamName: String!, $teamShortName: String!, $teamId: Int!) {
  updateTeamByTeamId(
    input: { teamPatch: { teamShortName: $teamShortName, teamName: $teamName }, teamId: $teamId }
  ) {
    team {
      teamId
      teamName
      teamShortName
      auctionAuctionId
    }
  }
}
`
export const DELETE_TEAM = gql`
mutation MyMutation($teamId: Int!) {
  deleteTeamByTeamId(input: {teamId: $teamId}) {
    clientMutationId
    deletedTeamId
  }
}

`
// PLAYER
export const CREATE_PLAYER = gql`
mutation MyMutation($playerName: String = "", $playerAge: Int = 0, $playerPhoneNumber: String = "", $playerStyle: String = "", $auctionAuctionId: Int = 0) {
  createPlayer(
    input: {player: {playerName: $playerName, playerAge: $playerAge, playerPhoneNumber: $playerPhoneNumber, playerStyle: $playerStyle, auctionAuctionId: $auctionAuctionId}}
  ) {
    clientMutationId
    player {
      playerId
      playerAge
      playerBidAmount
      playerName
      playerPhoneNumber
      playerStyle
    }
  }
}
`
export const UPDATE_PLAYER = gql`
mutation MyMutation($playerId: Int = 0, $playerAge: Int = 0, $playerName: String = "", $playerPhoneNumber: String = "", $playerStyle: String = "") {
  updatePlayerByPlayerId(
    input: {playerPatch: {playerAge: $playerAge, playerName: $playerName, playerPhoneNumber: $playerPhoneNumber, playerStyle: $playerStyle}, playerId: $playerId}
  ) {
    player {
      playerAge
      playerBidAmount
      playerName
      playerPhoneNumber
      playerStyle
    }
  }
}
`
export const DELETE_PLAYER = gql`
mutation MyMutation($playerId: Int = 0) {
  deletePlayerByPlayerId(input: {playerId: $playerId})
   {
        clientMutationId
    }
}
`
// AUCTIOAN PANEL
export const UPDATE_PLAYER_BID_AMOUNT = gql`
mutation MyMutation($playerId: Int = 0, $playerBidAmount: Int = 0) {
  updatePlayerByPlayerId(
    input: {playerPatch: {playerBidAmount: $playerBidAmount}, playerId: $playerId}
  ) {
    clientMutationId
  }
}
`
export const CREATE_AUCTION_PLAYER = gql`
mutation MyMutation($auctionAuctionId: Int = 0, $playerPlayerId: Int = 0, $teamTeamId: Int = 0) {
  createAuctionPlayer(
    input: {auctionPlayer: {auctionAuctionId: $auctionAuctionId, playerPlayerId: $playerPlayerId, teamTeamId: $teamTeamId}}
  ) {
    clientMutationId
  }
}
`
export const UPDATE_TEAM_BALANCE_BUDGET = gql`
mutation MyMutation($teamId: Int = 0, $balanceBudget: Int = 0) {
  updateTeamByTeamId(
    input: {teamPatch: {balanceBudget: $balanceBudget}, teamId: $teamId}
  ) {
    clientMutationId
  }
}
`
export const UPDATE_AUCTION_STATUS = gql`
mutation MyMutation($auctionId: Int = 0, $auctionStatus: AuctionAuctionStatusEnum!) {
  updateAuctionByAuctionId(
    input: {auctionPatch: {auctionStatus: $auctionStatus}, auctionId: $auctionId}
  ){
    clientMutationId
  }
}
` 
