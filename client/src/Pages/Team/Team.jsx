import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import './Team.css'
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


const Team = () => {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const { teamAuction, setTeamAuction, teamId, setTeamId } = useContext(GlobalContext)
    const [teams, setTeams] = useState([])
    const [editIndex, setEditIndex] = useState(null)
    const [eInde, setEIndex] = useState(null)
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [teamFlag, setTeamFlag] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();
    const [createTeam] = useMutation(CREATE_TEAM);
    const [updateTeam] = useMutation(UPDATE_TEAM);
    const [deleteTeam] = useMutation(DELETE_TEAM);

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
            console.log(formattedTeams);
            setTeams(formattedTeams);
        }
    }, [fetchedTeam]);

    // async function fetchTeams(id) {
    //     if (!id) return;
    //     const query = `
    //         query {
    //             getTeamsByAuction(auction_id: ${id}) {
    //                 team_id
    //                 team_logo
    //                 team_name
    //                 team_short_name
    //                 auction_id
    //                 budget
    //                 total_budget
    //             }
    //         }
    //     `;

    //     try {
    //         const response = await axios.post(url, { query })

    //         if (response.data.errors) {
    //             toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 })
    //             return;
    //         }
    //         console.log(response.data.data.getTeamsByAuction);
    //         setTeams(response.data.data.getTeamsByAuction)
    //     } catch (error) {
    //         console.error("Error fetching teams:", error)
    //         toast.error("Failed to fetch teams.", { position: "top-right", autoClose: 2000 })
    //     }
    // }




    // useEffect(() => {
    // if (!teamAuction) return
    // localStorage.setItem("teamAuction", JSON.stringify(teamAuction))
    // const id = teamAuction.auction_id

    // fetchTeams(id)
    // }, [teamAuction]);


    const onSubmit = async (teamData) => {
        try {
            const teamDetails = {
                teamName: teamData.team_name.trim(),
                teamShortName: teamData.team_short_name.trim(),
                auctionAuctionId: parseInt(teamAuction?.auctionId, 10),
            };

            if (!teamDetails.auctionAuctionId) {
                toast.error("Auction ID is missing", { position: "top-right", autoClose: 2000 });
                return;
            }

            console.log("Sending Data:", teamDetails);

            if (editIndex !== null) {
                const updateVariables = {
                    teamId: editIndex,
                    teamName: teamDetails.teamName,
                    teamShortName: teamDetails.teamShortName,
                };
                console.log(updateVariables);

                const res = await updateTeam({ variables: updateVariables });

                if (res.data) {
                    console.log("Updated Team:", res.data.updateTeamByTeamId.team);
                    setTeams((prevTeams) =>
                        prevTeams.map((team) =>
                            team.teamId === editIndex ? res.data.updateTeamByTeamId.team : team
                        )
                    );
                    toast.success("Team Updated Successfully!", { position: "top-right", autoClose: 1000 });
                    reset();
                    setEditIndex(null);
                    setTeamFlag(false);
                }
            } else {
                const res = await createTeam({
                    variables: teamDetails,
                });

                if (res.data) {
                    console.log("Response Data:", res.data.createTeam.team);
                    setTeams((prevTeams) => [...prevTeams, res.data.createTeam.team]);
                    toast.success("Team Created Successfully!", { position: "top-right", autoClose: 1000 });
                    reset();
                    setTeamFlag(null);
                }
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Issue in submission", { position: "top-right", autoClose: 2000 });
        }
    };


    const handleCancel = () => {
        reset();
        setTeamFlag(null)
    };

    const handleEdit = (index, team) => {
        setTeamFlag(true)
        setEIndex(index)
        setEditIndex(team.teamId)
        setValue("team_name", team.teamName)
        setValue("team_short_name", team.teamShortName)
    }

    const handleDelete = async (index, team) => {
        console.log("Deleting team at index:", index);
        console.log("Deleting team at team:", team.teamId);
        try {
            const res = await deleteTeam({ variables: { teamId: team.teamId }, fetchPolicy: "no-cache" })
            if (res.data) {
                setTeams((prevTeams) => prevTeams.filter((t) => t.teamId !== team.teamId));
                toast.success("Team Deleted Successfully!", { position: "top-right", autoClose: 1000 });
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Issue in deleting Auction", { position: "top-right", autoClose: 2000 });
        }
    };

    const handleViewPlayers = (index, team) => {

        console.log(index);
        console.log(team);
        setTeamId(team)
        navigate('/Dashboard/MyAuction/Player')
    }

    return (
        <>
            <div id='team-main-div'>
                <div id='team-inner-div'>
                    <div id='team-header-div'>
                        <div >
                            <h1>TEAMS</h1>
                        </div>
                        <div>
                            <button id='add-bt' onClick={() => setTeamFlag(!teamFlag)}>
                                <b>+  ADD</b>
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
                                            {

                                                !team.balanceBudget ?

                                                    <div>
                                                        <p>
                                                            <AiFillEdit size={25} style={{ cursor: "pointer", color: "#008000" }} onClick={() => handleEdit(index, team)} />
                                                        </p>
                                                        <p>
                                                            <MdDeleteForever size={25} style={{ cursor: "pointer", color: "#FF0000" }} onClick={() => handleDelete(index, team)} />
                                                        </p>
                                                    </div>
                                                    :
                                                    <div >
                                                        <h4 style={{ cursor: "pointer", border: "1px  solid black ", padding: "5px", borderRadius: "5px", backgroundColor: "#000066", color: "white" }} onClick={() => handleViewPlayers(index, team)}>view players </h4>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No teams available</p>
                            )}
                        </div>

                        {
                            teamFlag &&

                            <div id='team-from-pop'>
                                <form onSubmit={handleSubmit(onSubmit)} id='team-from'>
                                    <div className='form-group'>
                                        <label style={{ lineHeight: "2" }}> Team Name: </label><br />
                                        <input type="text" {...register("team_name", { required: "Team name is required" })} placeholder="Enter Team Name" className="inputs" />
                                        {errors.team_name && <p className="error">{errors.team_name.message}</p>}
                                    </div>
                                    <div className='form-group'>
                                        <label style={{ lineHeight: "2" }}> Team Short Name: </label><br />
                                        <input type="text" {...register("team_short_name", { required: "Short name is required" })} placeholder="Enter Short Name" className="inputs" />
                                        {errors.team_short_name && <p className="error">{errors.team_short_name.message}</p>}
                                    </div>
                                    <div className='form-group-btn'>
                                        <button type="submit" className="submit_bt" id='team-submit'><b>{editIndex ? "UPDATE" : "SUBMIT"}</b></button>
                                        <button type="button" className="submit_bt" id='team-cancel' onClick={handleCancel} ><b> CANCEL </b></button>
                                    </div>
                                </form>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Team;
