import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GlobalContext } from "../../context/GlobalContext";
import { useLocation, useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import "./PlayerResult.css";

const CREATE_PLAYER = gql`
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
const UPDATE_PLAYER = gql`
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
const ALL_AUCTION_PLAYER = gql`
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
const DELETE_PLAYER = gql`
mutation MyMutation($playerId: Int = 0) {
  deletePlayerByPlayerId(input: {playerId: $playerId})
   {
        clientMutationId
    }
}
`
const GET_PLAYER_BY_TEAM_ID = gql`
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
        playerBidAmount
      }
    }
  }
}
`

const PlayerResult = () => {
  const url = import.meta.env.VITE_GRAPHQL_URL
  const { playerAuction, setPlayerAuction, teamId, setTeamId } = useContext(GlobalContext)
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { data: playerByTeamId } = useQuery(GET_PLAYER_BY_TEAM_ID, {
    variables: {
      teamTeamId: teamId.teamId
    },
    fetchPolicy: "no-cache"
  })

  useEffect(() => {
    if (playerByTeamId?.allAuctionPlayers?.nodes?.length > 0) {
      console.log("Setting playerAuction:", playerByTeamId.allAuctionPlayers.nodes);
      const mapedPlayer = playerByTeamId.allAuctionPlayers.nodes.map((m) => m.playerByPlayerPlayerId)
      setPlayers(mapedPlayer);
    }
  }, [playerByTeamId, teamId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const auctionIdFromUrl = params.get("auctionId");
    if (auctionIdFromUrl) {
      setPlayerAuction({ auctionId: parseInt(auctionIdFromUrl) });
    }
    console.log(teamId);
  }, []);

  useEffect(() => {
    if (playerAuction?.auctionId) {
      navigate(`?auctionId=${playerAuction.auctionId}`, { replace: true });
    }
  }, [playerAuction]);


  const { data: fetchedPlayer, loading, error } = useQuery(ALL_AUCTION_PLAYER, {
    fetchPolicy: "no-cache",
    skip: !playerAuction?.auctionId,
    variables: { auctionAuctionId: playerAuction?.auctionId || 0 }
  });

  useEffect(() => {
    if (fetchedPlayer?.allPlayers) {
      const formattedPlayers = fetchedPlayer.allPlayers.edges.map(edge => edge.node);
      console.log(formattedPlayers);
      setPlayers(formattedPlayers);
    }
  }, [fetchedPlayer]);


  const handleBack = () => {
    window.history.back()
    setTeamId(0)
  }

  return (
    <>
      <div id="player-result-main-div">
        <div id="player-inner-div">
          <div id="player-header-div">
            <div>
              <h3 style={{ marginRight: "200px" }}>{teamId.team_name}</h3>
              <h1> PLAYERS</h1>
            </div>
            <div>
              <button id="add-btn" onClick={handleBack} style={{ width: "100px", margin: "10px" }}>
                <b>
                  BACK
                </b>
              </button>
            </div>
          </div>

          <div id="player-body-div">
            <div className="players-table-container">
              {players.length > 0 ? (
                <table className="players-table">
                  <thead id="thead">
                    <tr>
                      <th>Sno</th>
                      {/* <th>Name</th> */}
                      <th>Phone</th>
                      <th>Age</th>
                      <th>Style</th>
                      <th>bid amount</th>
                    </tr>
                  </thead>
                  <tbody id="tbody">
                    {players.map((player, index) => (
                      <tr key={index} id="row">
                        <td>{index + 1}</td>
                        <td>{player.playerName}</td>
                        {/* <td>{player.playerPhoneNumber || "-"}</td> */}
                        <td>{player.playerAge || "-"}</td>
                        <td>{player.playerStyle || "-"}</td>
                        <td>{player.playerBidAmount || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No players found.</p>
              )}
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default PlayerResult;
