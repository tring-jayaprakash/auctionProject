import { gql } from "@apollo/client";

export const GET_TEAM_BY_AUCTION_ID = gql`
query guest($auctionAuctionId: Int = 0) {
  allTeams(condition: {auctionAuctionId: $auctionAuctionId}) {
    edges {
      node {
        auctionAuctionId
        balanceBudget
        teamName
        teamShortName
        totalBudget
        teamId
      }
    }
  }
}

`
export const ALL_AUCTION_PLAYER = gql`
query guest($auctionAuctionId: Int = 0) {
  allPlayers(condition: {auctionAuctionId: $auctionAuctionId}) {
    edges {
      node {
        playerAge
        playerId
        playerName
        playerPhoneNumber
        playerStyle
        playerBidAmount
      }
    }
  }
}
`
export const GET_PLAYER_BY_TEAM_ID = gql`
query guest($teamTeamId: Int = 0) {
  allAuctionPlayers(condition: {teamTeamId: $teamTeamId}) {
    nodes {
      playerByPlayerPlayerId {
        playerAge
        playerBidAmount
        playerId
        playerName
        playerPhoneNumber
        playerStyle
      }
    }
  }
}
`
// AUCTION PANEL
export const GET_AUCTION_BY_AUCTION_ID = gql`
query guest($auctionId: Int = 0) {
  allAuctions(condition: {auctionId: $auctionId}) {
    edges {
      node {
        auctionId
        auctionName
        auctionStatus
        baseBid
        bidIncreaseBy
        date
        maxPlayer
        minPlayer
      }
    }
  }
}
`
export const GET_ALL_AUCTION_PLAYER = gql`
query guest {
  allAuctionPlayers {
    nodes {
      auctionAuctionId
      playerPlayerId
      teamTeamId
    }
  }
}
`
// MY PROFILE
export const GET_USER_BY_USER_ID = gql`
query guest($userId: Int = 0) {
  allUsers(condition: {userId: $userId}) {
    nodes {
      city
      email
      phoneNumber
      userName
    }
  }
}
`
// AUCTION RESULT
export const FETCH_ALL_AUCTION = gql`
query  guest{
  allAuctions {
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
