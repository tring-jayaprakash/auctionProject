import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GlobalContext } from '../../context/GlobalContext';
import { GET_TEAM_BY_AUCTION_ID } from '../../../graphql/query/userQuery';
import './TeamResult.css'

const TeamResult = () => {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const { teamAuction, setTeamAuction, teamId, setTeamId, playerAuction, setPlayerAuction } = useContext(GlobalContext)
    const [teams, setTeams] = useState([])
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const auctionIdFromUrl = params.get("auctionId");
        if (auctionIdFromUrl) {
            setTeamAuction({ auctionId: parseInt(auctionIdFromUrl) });
        }
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
            setTeams(formattedTeams);
        }
    }, [fetchedTeam]);

    const handleViewPlayers = (index, team) => {
        setTeamId(team)
        setPlayerAuction(null)
        navigate('/Reault/PlayerResult')
    }
    const handleBack = () => {
        window.history.back()
    }
    return (
        <>
            <div id='team-result-main-div'>
                <div id='team-inner-div'>player_ph_number
                    <div id="player-header-div">
                        <div>
                            <h1> TEAMS</h1>
                        </div>
                        <div>
                            <button id="add-btn" onClick={handleBack} style={{ width: "100px", margin: "10px" }}>
                                <b>
                                    BACK
                                </b>
                            </button>
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
            </div >
        </>
    );
};

export default TeamResult
