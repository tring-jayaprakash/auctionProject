import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import "./PlayerResult.css";
import { GlobalContext } from "../../context/GlobalContext";
import { useNavigate } from "react-router-dom";

const PlayerResult = () => {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const { playerAuction, setPlayerAuction, teamId, setTeamId } = useContext(GlobalContext)
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [players, setPlayers] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editIndex, setEditIndex] = useState(-1)
    const [playerEditData, setPlayerEditData] = useState(null)
    const navigate = useNavigate()
    


    useEffect(() => {
        let storedAuction = localStorage.getItem("playerAuction");
        if (storedAuction) {
            setPlayerAuction(JSON.parse(storedAuction));
        }
    }, []);

    useEffect(() => {
        if (!playerAuction) return

        localStorage.setItem("playerAuction", JSON.stringify(playerAuction))
        const id = playerAuction.auction_id
        async function fetchPlayers() {
            if (!id) return;

            if (!teamId) {

                const query = `
                        query{
                            getPlayersByAuction(auction_id:${id})
                            {
                                player_id
                                player_pic
                                player_name
                                father_name
                                player_ph_number
                                age
                                form_number
                                player_style
                                team_id
                            }
                        }
                    `
                try {
                    const response = await axios.post(url, { query });

                    if (response.data.errors) {
                        toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                        return;
                    }
                    console.log(response.data.data.getPlayersByAuction);
                    setPlayers(response.data.data.getPlayersByAuction);
                } catch (error) {
                    console.error("Error fetching players:", error);
                    toast.error("Failed to fetch players.", { position: "top-right", autoClose: 2000 });
                }
            } else {


                const query = `query{
                        getPlayersByTeam(team_id:${Number(teamId.team_id)}){
                            player_id
                            player_pic
                            player_name
                            father_name
                            player_ph_number
                            age
                            form_number
                            player_style
                            team_id
                        }
                      }`
                try {
                    const response = await axios.post(url, { query });

                    if (response.data.errors) {
                        toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                        return;
                    }
                    console.log(response.data.data.getPlayersByTeam);
                    setPlayers(response.data.data.getPlayersByTeam);
                } catch (error) {
                    console.error("Error fetching players:", error);
                    toast.error("Failed to fetch players.", { position: "top-right", autoClose: 2000 });
                }
            }



        }

        fetchPlayers()
    }, [playerAuction]);


    const onSubmit = async (playerData) => {

        const newPlayer = {
            player_pic: playerData.player_pic || "",
            player_name: playerData.player_name,
            father_name: playerData.father_name || "",
            player_ph_number: playerData.player_ph_number || "",
            age: playerData.age || "",
            form_number: playerData.form_number,
            player_style: playerData.player_style || "",
        };

        if (editIndex !== -1) {
            try {
                const id = Number(playerEditData.player_id);
                console.log(id);
                const query = `
                mutation {
                    updatePlayer(
                        player_id: ${Number(playerEditData.player_id)},
                        player_name: "${newPlayer.player_name}",
                        father_name: "${newPlayer.father_name}",
                        player_ph_number: "${newPlayer.player_ph_number}",
                        age: "${newPlayer.age}",
                        form_number: "${newPlayer.form_number}",
                        player_style: "${newPlayer.player_style}"
                    ) {
                        player_id
                        player_name
                        father_name
                        player_ph_number
                        age
                        player_style
                        form_number
                        team_id
                        auction_id
                    }
                }
            `;

                const response = await axios.post(url, { query });

                if (response.data.errors) {
                    toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                    return;
                }

                setPlayers((prevPlayers) => {
                    const updatedPlayers = [...prevPlayers];
                    updatedPlayers[editIndex] = response.data.data.updatePlayer;
                    return updatedPlayers;
                });

                toast.success("Player Updated Successfully", { position: "top-right", autoClose: 1000 });
            } catch (error) {
                console.error("Error updating player:", error);
                toast.error("Failed to update player. Please try again.", { position: "top-right", autoClose: 2000 });
            }
            setEditIndex(-1)
        } else {

            try {
                const query = `
                mutation {
                  addPlayer(
                    player_name: "${newPlayer.player_name}",
                    father_name: "${newPlayer.father_name}",
                    player_ph_number: "${newPlayer.player_ph_number}",
                    age: "${newPlayer.age}",
                    form_number: "${newPlayer.form_number}",
                    player_style: "${newPlayer.player_style}",
                    auction_id:${playerAuction.auction_id}
                  ) {
                    player_id
                    player_pic
                    player_name
                    father_name
                    player_ph_number
                    age
                    player_style
                    form_number
                    team_id
                    auction_id
                  }
                }
            `;

                const response = await axios.post(url, { query });

                if (response.data.errors) {
                    toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                    return;
                }

                // setPlayers((prevPlayers) => [...prevPlayers, newPlayer]);
                setPlayers((prevPlayers) => [...prevPlayers, response.data.data.addPlayer]);

                toast.success("Player Added Successfully", { position: "top-right", autoClose: 1000 });
                reset();

            } catch (error) {
                console.error("Error adding player:", error);
                toast.error("Failed to add player. Please try again.", { position: "top-right", autoClose: 2000 });
            }
        }
        setFormVisible(false);
        setEditIndex(-1)
        setPlayerEditData(null)

    }


    const handleEdit = (player, index) => {
        setFormVisible(true)
        setEditIndex(index)
        setPlayerEditData(player)
        setValue("player_name", player.player_name);
        setValue("father_name", player.father_name);
        setValue("player_ph_number", player.player_ph_number);
        setValue("age", player.age);
        setValue("player_style", player.player_style);
    }

    const handleCancel = () => {
        setFormVisible(false)
        setEditIndex(-1);
        setPlayerEditData(null)
        reset()
    }

    const handleDelete = async (player, index) => {
        try {

            const query = `
            mutation {
                deletePlayer(player_id: ${player.player_id})
            }
        `
            const response = await axios.post(url, { query })
            if (response.data.errors) {
                toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                return;
            }

            // setPlayers((prevPlayers) => prevPlayers.filter((f) => f.player_id != player.player_id))
            setPlayers((prevPlayers) => prevPlayers.filter((f) => f.player_id !== player.player_id));

            toast.success("Player deleted successfully", { position: "top-right", autoClose: 1000 });
        } catch (error) {
            console.error("Error deleting player:", error);
            toast.error("Failed to delete player.", { position: "top-right", autoClose: 2000 });
        }
    }

    const handleAddPlayer = () => {
        setFormVisible(!formVisible)
        setEditIndex(-1)
        reset()
    }

    const handleBack = ()=>{
        navigate('/Dashboard/MyAuction/Team')
        setTeamId(0)
    }

    return (
        <>
            <div id="player-result-main-div">
                <div id="player-inner-div">
                    <div id="player-header-div">
                        <div>
                            <h3 style={{marginRight:"200px",padding:"20px"}}>{teamId.team_name}</h3>
                            <h1> PLAYERS</h1>
                        </div>
                        <div>

                                <button id="add-btn" onClick={handleAddPlayer}  style={{display:"none"}}>
                                    
                                </button>
                        </div>
                    </div>

                    {formVisible && (
                        <div id="player-form-popup">
                            <form onSubmit={handleSubmit(onSubmit)} id="player-form">
                                <div className="form-group-players" style={{ paddingTop: "40px" }}>
                                    <div id="div">
                                        <label className="req" >Player Name </label>
                                        {errors.player_name && <p className="error">{errors.player_name.message}</p>}
                                    </div>
                                    <div>
                                        <input type="text" {...register("player_name", { required: "Name is required" })} />
                                    </div>
                                </div>
                                <div className="form-group-players">
                                    <div id="div">
                                        <label >Last Name </label>
                                    </div>
                                    <div>
                                        <input type="text" {...register("father_name")} />
                                    </div>
                                </div>
                                <div className="form-group-players">
                                    <div id="div">
                                        <label >Phone Number </label>
                                    </div>
                                    <div>
                                        <input type="text" {...register("player_ph_number")} />
                                    </div>
                                </div>
                                <div className="form-group-players">
                                    <div id="div">
                                        <label >Age </label>
                                    </div>
                                    <div>
                                        <input type="number" {...register("age")} />
                                    </div>
                                </div>
                                <div className="form-group-players">
                                    <div id="div">
                                        <label className="req" >Player Style </label>
                                        {errors.player_style && <p className="error">{errors.player_style.message}</p>}
                                    </div>
                                    <div>
                                        <input type="text" {...register("player_style", { required: "Player Style is required" })} />
                                    </div>
                                </div>
                                <div className="form-group-players" id="btn-div">
                                    <button type="submit" className="submit_bt" id="team-submit" ><b>{editIndex !== -1 ? "UPDATE" : "SUBMIT"}</b></button>
                                    <button type="button" className="submit_bt" id="team-cancel" onClick={handleCancel}><b>CANCEL</b></button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div id="player-body-div">
                        <div className="players-table-container">
                            {players.length > 0 ? (
                                <table className="players-table">
                                    <thead id="thead">
                                        <tr>
                                            <th>Sno</th>
                                            <th>Name</th>
                                            <th>Last name</th>
                                            {/* <th>Phone</th> */}
                                            <th>Age</th>
                                            <th>Style</th>
                                            {/* {
                                                !teamId.team_id &&
                                                <th>Actions</th>
                                            } */}
                                        </tr>
                                    </thead>
                                    <tbody id="tbody">
                                        {players.map((player, index) => (
                                            <tr key={index} id="row">
                                                <td>{index + 1}</td>
                                                <td>{player.player_name}</td>
                                                <td>{player.father_name || "N/A"}</td>
                                                {/* <td>{player.player_ph_number || "N/A"}</td> */}
                                                <td>{player.age || "N/A"}</td>
                                                <td>{player.player_style || "N/A"}</td>

                                                {/* {
                                                    !teamId.team_id &&
                                                    < td id="action">
                                                        <AiFillEdit size={20} className="edit-icon" onClick={() => handleEdit(player, index)} style={{ cursor: "pointer" }} />
                                                        <MdDeleteForever size={20} className="delete-icon" onClick={() => handleDelete(player, index)} style={{ cursor: "pointer" }} />
                                                    </td>
                                                } */}
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
