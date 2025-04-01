import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import "./Player.css";
import { GlobalContext } from "../../context/GlobalContext";
import { useLocation, useNavigate } from "react-router-dom";
import { gql, useMutation, useQuery } from "@apollo/client";
import { CREATE_PLAYER, DELETE_PLAYER, UPDATE_PLAYER } from "../../../graphql/mutation/userMutation";
import { ALL_AUCTION_PLAYER, GET_PLAYER_BY_TEAM_ID } from "../../../graphql/query/userQuery";

const Player = () => {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const { playerAuction, setPlayerAuction, teamId, setTeamId } = useContext(GlobalContext)
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [players, setPlayers] = useState([]);
    const [formVisible, setFormVisible] = useState(false);
    const [editIndex, setEditIndex] = useState(null)
    const [playerEditData, setPlayerEditData] = useState(null)
    const navigate = useNavigate();
    const location = useLocation();
    const [createPlayer] = useMutation(CREATE_PLAYER)
    const [updatePlayer] = useMutation(UPDATE_PLAYER)
    const [deletePlayer] = useMutation(DELETE_PLAYER)
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
            setPlayers(formattedPlayers);
        }
    }, [fetchedPlayer]);

    const onSubmit = async (playerData) => {

        try {
            const newEntity = {
                playerName: playerData.player_name,
                playerAge: Number(playerData.age),
                playerPhoneNumber: playerData.player_ph_number,
                playerStyle: playerData.player_style,
                auctionAuctionId: playerAuction.auctionId
            }

            if (!newEntity.auctionAuctionId) {
                toast.error("Auction ID is missing", { position: "top-right", autoClose: 2000 });
                return;
            }

            if (editIndex !== null) {
                console.log("edit");
                const updateVariables = {
                    playerId: editIndex,
                    playerAge: newEntity.playerAge,
                    playerName: newEntity.playerName,
                    playerPhoneNumber: newEntity.playerPhoneNumber,
                    playerStyle: newEntity.playerStyle
                }
                const res = await updatePlayer({ variables: updateVariables })
                console.log("Updated Team:", res.data.updatePlayerByPlayerId.player);
                setPlayers((prevPlayer) =>
                    prevPlayer.map((player) =>
                        player.playerId === editIndex ? res.data.updatePlayerByPlayerId.player : player
                    )
                );
                setEditIndex(null)
                toast.success("Team Updated Successfully!", { position: "top-right", autoClose: 1000 });
                reset();
            } else {
                const { data } = await createPlayer({
                    variables: newEntity
                })
                console.log(data.createPlayer.player);
                setPlayers((prev => [...prev, data.createPlayer.player]))
                console.log("Player and Auction linked successfully");
            }

        } catch (err) {
            console.log(err);

        }


        setFormVisible(false);
        // setEditIndex(-1)
        // setPlayerEditData(null)

    }

    const handleEdit = (player, index) => {
        setFormVisible(true)
        setEditIndex(player.playerId)
        console.log(index);
        setPlayerEditData(index)
        setValue("player_name", player.playerName);
        setValue("player_ph_number", player.playerPhoneNumber);
        setValue("age", player.playerAge);
        setValue("player_style", player.playerStyle);
    }

    const handleCancel = () => {
        setFormVisible(false)
        setEditIndex(null);
        setPlayerEditData(null)
        reset()
    }

    const handleDelete = async (player, index) => {
        try {
            console.log(player.playerId);
            const res = await deletePlayer({
                variables: {
                    playerId: player.playerId
                },
                fetchPolicy: "no-cache"
            })
            setPlayers((prev) => prev.filter((p) => p.playerId !== player.playerId))
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddPlayer = () => {
        setFormVisible(!formVisible)
        setEditIndex(null)
        reset()
    }

    const handleBack = () => {
        navigate('/Dashboard/MyAuction/Team')
        setTeamId(0)
    }
    return (
        <>
            <div id="player-main-div">
                <div id="player-inner-div">
                    <div id="player-header-div">
                        <div>
                            <h3 style={{ marginRight: "200px" }}>{teamId.team_name}</h3>
                            <h1> PLAYERS</h1>
                        </div>
                        <div>
                            {!teamId.team_name ?

                                <button id="add-btn" onClick={handleAddPlayer}>
                                    <b>
                                        + ADD PLAYER
                                    </b>
                                </button>
                                :
                                <button id="add-btn" onClick={handleBack} style={{ width: "100px" }}>
                                    <b>
                                        BACK
                                    </b>
                                </button>
                            }
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
                                            {/* <th>Last name</th> */}
                                            <th>Phone</th>
                                            <th>Age</th>
                                            <th>Style</th>
                                            {
                                                !teamId.team_id ?
                                                    <th>Actions</th> :
                                                    <th>bid amount</th>
                                            }
                                        </tr>
                                    </thead>
                                    <tbody id="tbody">
                                        {players.map((player, index) => (
                                            <tr key={index} id="row">
                                                <td>{index + 1}</td>
                                                <td>{player.playerName}</td>
                                                {/* <td>{player.father_name || "N/A"}</td> */}
                                                <td>{player.playerPhoneNumber || "-"}</td>
                                                <td>{player.playerAge || "-"}</td>
                                                <td>{player.playerStyle || "-"}</td>

                                                {
                                                    !teamId.team_id ?
                                                        < td id="action">
                                                            <AiFillEdit size={20} className="edit-icon" onClick={() => handleEdit(player, index)} style={{ cursor: "pointer" }} />
                                                            <MdDeleteForever size={20} className="delete-icon" onClick={() => handleDelete(player, index)} style={{ cursor: "pointer" }} />
                                                        </td>
                                                        :
                                                        <td>{player.bid_amount || "N/A"}</td>
                                                }
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

export default Player;
