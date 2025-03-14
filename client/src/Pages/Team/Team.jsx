import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Team.css'
import { AiFillEdit } from 'react-icons/ai';
import { MdDeleteForever } from 'react-icons/md';
import { GlobalContext } from '../../context/GlobalContext';

const Team = () => {
    const { teamAuction, setTeamAuction } = useContext(GlobalContext)
    const [teams, setTeams] = useState([])
    const [editIndex, setEditIndex] = useState(null)
    const [eInde, setEIndex] = useState(null)
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [teamFlag, setTeamFlag] = useState(false)

    useEffect(() => {

        console.log(teamAuction);

        let storedAuction = localStorage.getItem("teamAuction");
        if (storedAuction) {
            setTeamAuction(JSON.parse(storedAuction));
        }

    }, []);

    async function fetchTeams(id) {
        if (!id) return;
        const query = `
            query {
                getTeamsByAuction(auction_id: ${id}) {
                    team_id
                    team_logo
                    team_name
                    team_short_name
                    auction_id
                }
            }
        `;

        try {
            const response = await axios.post("http://localhost:2500/graphql", { query })

            if (response.data.errors) {
                toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 })
                return;
            }

            setTeams(response.data.data.getTeamsByAuction)
        } catch (error) {
            console.error("Error fetching teams:", error)
            toast.error("Failed to fetch teams.", { position: "top-right", autoClose: 2000 })
        }
    }




    useEffect(() => {
        if (!teamAuction) return
      
        
        localStorage.setItem("teamAuction", JSON.stringify(teamAuction))
        const id = teamAuction.auction_id

        fetchTeams(id)

    }, [teamAuction]);

    const onSubmit = async (teamData) => {
        const teamDetails = {
            team_logo: teamData.team_logo || "",
            team_name: teamData.team_name,
            team_short_name: teamData.team_short_name,
            auction_id: parseInt(teamAuction?.auction_id) || null,
        };

        try {
            let query;
            if (editIndex) {

                query = `
                    mutation {
                        updateTeam(
                            team_id: ${editIndex},
                            team_logo: "${teamDetails.team_logo}",
                            team_name: "${teamDetails.team_name}",
                            team_short_name: "${teamDetails.team_short_name}",
                            auction_id: ${teamDetails.auction_id}
                        )
                         {
                            team_id
                            team_logo
                            team_name
                            team_short_name
                            auction_id
                        }
                    }
                `;
            } else {
                query = `
                    mutation {
                        addTeam(
                            team_logo: "${teamDetails.team_logo}",
                            team_name: "${teamDetails.team_name}",
                            team_short_name: "${teamDetails.team_short_name}",
                            auction_id: ${teamDetails.auction_id}
                        ) {
                            team_id
                            team_logo
                            team_name
                            team_short_name
                            auction_id
                        }
                    }
                `;
            }

            const response = await axios.post("http://localhost:2500/graphql", { query });

            if (response.data.errors) {
                toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                return;
            }

            if (editIndex) {
                console.log(eInde);
                console.log(teams[eInde]);
                console.log(response.data.data.updateTeam);


                setTeams((prevTeam) => prevTeam[eInde] = response.data.data.updateTeam)
                localStorage.setItem("teamAuction", JSON.stringify(teamAuction))
                const id = teamAuction.auction_id
                fetchTeams(id);
                toast.success("Team Updated Successfully", { position: "top-right", autoClose: 1000 });
            } else {

                setTeams((prevTeams) => [...prevTeams, response.data.data.addTeam]);
                toast.success("Team Added Successfully", { position: "top-right", autoClose: 1000 });
            }

            reset();
            setTeamFlag(false);
            setEditIndex(null);

        } catch (error) {
            console.error("Error processing team:", error);
            toast.error("Operation failed. Please try again.", { position: "top-right", autoClose: 2000 });
        }
    };


    const handleCancel = () => {
        reset();
        setTeamFlag(null)
    };

    const handleEdit = (index, team) => {

        setTeamFlag(true)
        setEIndex(index)
        setEditIndex(team.team_id)
        setValue("team_name", team.team_name)
        setValue("team_short_name", team.team_short_name)

    }

    const handleDelete = async (index, team) => {
        console.log("Deleting team at index:", index);

        try {
            const query = `
                mutation {
                    deleteTeam(team_id: ${team.team_id})
                }
            `;

            const response = await axios.post("http://localhost:2500/graphql", { query });

            if (response.data.errors) {
                toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                return;
            }

            setTeams((prevTeams) => prevTeams.filter((t) => t.team_id !== team.team_id));

            toast.success("Team deleted successfully", { position: "top-right", autoClose: 1000 });

        } catch (error) {
            console.error("Error deleting team:", error);
            toast.error("Failed to delete team.", { position: "top-right", autoClose: 2000 });
        }
    };



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
                                    <div key={team.team_id} className='card-div'>
                                        <div className='card-div-body'>
                                            <div>
                                                <h2>{team.team_short_name}</h2>
                                            </div>
                                            <div>
                                                <h3>{team.team_name}</h3>
                                            </div>
                                        </div>
                                        <div className='card-div-footer'>
                                            <div>
                                                <p>
                                                    <AiFillEdit size={25} style={{ cursor: "pointer", color: "#008000" }} onClick={() => handleEdit(index, team)} />
                                                </p>
                                                <p>
                                                    <MdDeleteForever size={25} style={{ cursor: "pointer", color: "#FF0000" }} onClick={() => handleDelete(index, team)} />
                                                </p>
                                            </div>
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
