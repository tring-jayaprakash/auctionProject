import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiFillEdit } from 'react-icons/ai';
import { MdDeleteForever } from 'react-icons/md';
import { GlobalContext } from '../../context/GlobalContext';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_TEAM, DELETE_TEAM, UPDATE_TEAM } from '../../../graphql/mutation/userMutation';
import { GET_AUCTION_BY_AUCTION_ID, GET_TEAM_BY_AUCTION_ID } from '../../../graphql/query/userQuery';
import './Team.css'

const Team = () => {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const { teamAuction, setTeamAuction, teamId, setTeamId } = useContext(GlobalContext)
    const [teams, setTeams] = useState([])
    const [editIndex, setEditIndex] = useState(null)
    const [eInde, setEIndex] = useState(null)
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [teamFlag, setTeamFlag] = useState(false)
    const [auctionStatus, setAuctionStatus] = useState("")
    const navigate = useNavigate();
    const locations = useLocation();
    const { data: gatAuction } = useQuery(GET_AUCTION_BY_AUCTION_ID, {
        context: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        },
        variables: {
            auctionId: teamAuction?.auctionId
        }
    })
    useEffect(() => {
        if (gatAuction) {
            setAuctionStatus(gatAuction.allAuctions.edges[0].node.auctionStatus);
        }
    }, [gatAuction])
    const [createTeam] = useMutation(CREATE_TEAM, {
        context: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    });
    const [updateTeam] = useMutation(UPDATE_TEAM, {
        context: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    });
    const [deleteTeam] = useMutation(DELETE_TEAM, {
        context: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    });

    useEffect(() => {
        const params = new URLSearchParams(locations.search);
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

            if (editIndex !== null) {
                const updateVariables = {
                    teamId: editIndex,
                    teamName: teamDetails.teamName,
                    teamShortName: teamDetails.teamShortName,
                };
                const res = await updateTeam({ variables: updateVariables });

                if (res.data) {
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
        setTeamId(team)
        navigate('/Dashboard/MyAuction/Player')
    }
    const handleBack = () => {
        navigate('/Dashboard/MyAuction')
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
                            {auctionStatus == "PENDING" ?

                                <button id='add-bt' onClick={() => setTeamFlag(!teamFlag)}>
                                    <b>+  ADD</b>
                                </button>
                                :
                                <button id="add-btn" onClick={handleBack}  style={{ width: "100px" }}>
                                    <b>
                                        BACK
                                    </b>
                                </button>
                            }
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

                                                auctionStatus == "PENDING" ?

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
                                                        <h4 style={{ cursor: "pointer", padding: "5px", borderRadius: "5px", backgroundColor: "#10B981", color: "white" }} onClick={() => handleViewPlayers(index, team)}>view players </h4>
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
