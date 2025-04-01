import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './TeamResult.css'
import { AiFillEdit } from 'react-icons/ai';
import { MdDeleteForever } from 'react-icons/md';
import { GlobalContext } from '../../context/GlobalContext';
import { gql, useMutation, useQuery } from '@apollo/client';

const GET_TEAM_BY_AUCTION_ID = gql`
query MyQuery($auctionAuctionId: Int = 0) {
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
const CREATE_TEAM = gql`
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
`;

const UPDATE_TEAM = gql`
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
`;

const DELETE_TEAM = gql`
    mutation MyMutation($teamId: Int!) {
      deleteTeamByTeamId(input: {teamId: $teamId}) {
        clientMutationId
        deletedTeamId
      }
    }

`

const TeamResult = () => {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const { teamAuction, setTeamAuction, teamId, setTeamId } = useContext(GlobalContext)
    const [teams, setTeams] = useState([])
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const auctionIdFromUrl = params.get("auctionId");
        if (auctionIdFromUrl) {
            setTeamAuction({ auctionId: parseInt(auctionIdFromUrl) });
        }
        // setTeamId(0)
    }, []);

    useEffect(() => {
        if (teamAuction?.auctionId) {
            navigate(`?auctionId=${teamAuction.auctionId}`, { replace: true });
        }
    }, [teamAuction]);

    const { data: fetchedTeam, loading, error } = useQuery(GET_TEAM_BY_AUCTION_ID, {
        fetchPolicy: "no-cache",
        skip: !teamAuction?.auctionId,
        variables: { auctionAuctionId: teamAuction?.auctionId || 0 }
    });

    useEffect(() => {
        if (fetchedTeam?.allTeams) {
            const formattedTeams = fetchedTeam.allTeams.edges.map(edge => edge.node);
            console.log(formattedTeams);
            setTeams(formattedTeams);
        }
    }, [fetchedTeam]);

    const handleViewPlayers = (index, team) => {
        setTeamId(team)
        navigate('/Reault/PlayerResult')
    }

    return (
        <>
            <div id='team-result-main-div'>
                <div id='team-inner-div'>
                    <div id='team-result-header-div'>
                        <div >
                            <h1>TEAMS</h1>
                        </div>
                    </div>
                    <div id='team-body-div'>
                        <div id="team-card-div">

                            {teams.length > 0 ? (
                                teams.map((team, index) => (
                                    <div key={team.teamId} className='card-div'>
                                        <div className='card-div-body'>
                                            <div>
                                                <h2>{team.teamShortName}</h2>
                                            </div>
                                            <div>
                                                <h3>{team.teamName}</h3>
                                            </div>
                                            {

                                                team.balanceBudget &&
                                                <>
                                                    <div>
                                                        <h4>Balance : {team.balanceBudget}</h4>
                                                    </div>
                                                    <div>
                                                        <h4>Total Budget : {team.totalBudget}</h4>
                                                    </div>
                                                </>
                                            }

                                        </div>
                                        <div className='card-div-footer' style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
                                            <div >
                                                <h4 style={{ cursor: "pointer", padding: "5px", borderRadius: "5px", backgroundColor: "#10B981", color: "white" }} onClick={() => handleViewPlayers(index, team)}>view players </h4>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No teams available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TeamResult
