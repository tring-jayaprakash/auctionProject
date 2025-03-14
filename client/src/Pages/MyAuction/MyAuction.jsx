import React, { useContext, useEffect, useState } from 'react'
import { GrCursor, GrGroup } from "react-icons/gr";
import { GiBabyfootPlayers } from "react-icons/gi";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import './MyAuction.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GlobalContext } from '../../context/GlobalContext';
import { GET_AUCTION_BY_USER_ID, GET_TEAM_BY_AUCTION_ID } from '../../../graphql/query/userQuery';

const MyAuction = () => {
    const { auction, setAuction, teamAuction, setTeamAuction, playerAuction, setPlayerAuction, auctionPanal, setAuctionPanal } = useContext(GlobalContext)
    const navigater = useNavigate()
    const [auctionData, setAuctionData] = useState([])
    const [completedAuctions, setCompletedAuctions] = useState(() => {
        const storedAuctions = localStorage.getItem("completedAuctions");
        return storedAuctions ? JSON.parse(storedAuctions) : {};
    });
    const [showButton, setShowButton] = useState(true)

    useEffect(() => {

        let localUser = localStorage.getItem("user")
        const jsonUser = JSON.parse(localUser)
        console.log(jsonUser.user_id);
        let localPanal = localStorage.getItem("AuctionPanel")
        const panal = JSON.parse(localPanal)
        console.log(panal);

        if (!panal) {
            setShowButton(false)

        }
        async function getAuction() {
            const query = GET_AUCTION_BY_USER_ID;
            const variables = { user_id: Number(jsonUser.user_id) };

            try {
                const response = await axios.post("http://localhost:2500/graphql", { query, variables });
                if (response.data.errors) {
                    console.error("GraphQL Error:", response.data.errors[0].message);
                    return;
                }

                const auctionData = response.data.data.getAuctionByUserId;
                console.log("Auction Data:", auctionData);
                setAuctionData(auctionData);

            } catch (error) {
                console.error("Error fetching auctions:", error.message);
            }
        }

        getAuction()
    }, [])


    const handleDelete = async (index, id) => {
        console.log(index);
        console.log(id);

        const query = `
        mutation {
            deleteAuction(auction_id: "${id}")
        }
        `;

        try {
            const response = await axios.post("http://localhost:2500/graphql", { query });

            if (response.data.errors) {
                console.log(response.data.errors[0].message)
                return;
            }
            console.log(response.data.data.deleteAuction);

            setAuctionData(auctionData.filter((auction) => auction.auction_id !== id));

        } catch (error) {
            console.error("Delete error:", error);
        }
    }

    const handleEdit = (index, element) => {
        console.log(element);
        setAuction(element)
        navigater('/Dashboard/NewAuction')
    }

    const handleTeam = (index, element) => {
        setTeamAuction(element)
        navigater('/Dashboard/MyAuction/Team')
    }
    const handlePlayer = (index, element) => {
        console.log(index);
        console.log(element);
        setPlayerAuction(element)
        navigater('/Dashboard/MyAuction/Player')
    }



    async function fetchTeams(element) {

        let localUser = localStorage.getItem("user")
        const jsonUser = JSON.parse(localUser)

        const query = `
            query {
                getTeamsByAuction(auction_id: ${element.auction_id}) {
                    team_id
                    team_logo
                    team_name
                    team_short_name
                    auction_id
                }
            }
        `;

        // const query = GET_TEAM_BY_AUCTION_ID
        // const variables = { user_id: Number(jsonUser.user_id) };


        try {
            const response = await axios.post("http://localhost:2500/graphql", { query });
            // const response = await axios.post("http://localhost:2500/graphql", { query, variables });

            if (response.data.errors) {
                toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                return [];
            }
            console.log("Fetched Teams:", response.data.data.getTeamsByAuction);
            // toast.success("sucessfully fetch teams.", { position: "top-right", autoClose: 2000 });
            return response.data.data.getTeamsByAuction;
        } catch (error) {
            console.error("Error fetching teams:", error);
            toast.error("Failed to fetch teams.", { position: "top-right", autoClose: 2000 });
            return [];
        }
    }


    async function fetchPlayers(element) {
        const query = `
            query {
                getPlayersByAuction(auction_id: ${element.auction_id}) {
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
        `;

        try {
            const response = await axios.post("http://localhost:2500/graphql", { query });

            if (response.data.errors) {
                toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                return [];
            }
            console.log("Fetched Players:", response.data.data.getPlayersByAuction);
            return response.data.data.getPlayersByAuction;
        } catch (error) {
            console.error("Error fetching players:", error);
            toast.error("Failed to fetch players.", { position: "top-right", autoClose: 2000 });
            return [];
        }
    }

    async function updateTeamBudget(element, finalBudget) {
        const query = `
        mutation{
          updateTeamBudget(auction_id:${element.auction_id},budget:${finalBudget},total_budget:${finalBudget})
        }
        `
        try {
            const response = await axios.post("http://localhost:2500/graphql", { query });

            if (response.data.errors) {
                toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                return [];
            }
            console.log("Fetched Players:", response.data.data.updateTeamBudget);
        } catch (error) {
            console.error("Error fetching players:", error);
            toast.error("Failed to fetch players.", { position: "top-right", autoClose: 2000 });
        }
    }

    const handleStartAction = async (element, index) => {
        try {
            const playerData = await fetchPlayers(element);
            const teamData = await fetchTeams(element);
            const minPlayer = Number(element.min_player);
            console.log(playerData);

            const playerWithTeam = playerData.find(player => player.team_id);
            if (playerWithTeam) {
                toast.info("Auction ended", { position: "top-right", autoClose: 2000 });

                setCompletedAuctions(prev => {
                    const updated = { ...prev, [element.auction_id]: true };
                    localStorage.setItem("completedAuctions", JSON.stringify(updated));
                    return updated;
                });

                return;
            }

            const budget = element.base_bit * teamData.length * playerData.length
            const finalBudget = budget + budget * 50 / 100
            await updateTeamBudget(element, finalBudget);

            if (teamData.length * minPlayer <= playerData.length) {
                const auctionDate = new Date(Number(element.date));
                const [hours, minutes, seconds] = element.time.split(":").map(Number);
                auctionDate.setHours(hours, minutes, seconds, 0);
                const now = new Date();

                if (now.getTime() >= auctionDate.getTime()) {
                    setAuctionPanal(element);
                    navigater('/Dashboard/AuctionalPanel');
                } else {
                    toast.info("The auction can only start at the scheduled time!", { position: "top-right", autoClose: 2000 });
                }
            } else {
                toast.error("Not enough players for the auction!", { position: "top-right", autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error in handleStartAction:", error);
            toast.error("An error occurred while starting the auction.", { position: "top-right", autoClose: 2000 });
        }
    };



    return (
        <>
            <div id='my-main-div'>
                <div id='my-inner-div'>
                    <div id='my-header-div'>
                        <div >
                            <h1>
                                My Auction
                            </h1>
                        </div>
                        <div>
                            <button id='add-bt' onClick={() => navigater('/Dashboard/NewAuction')}>
                                <b>+  ADD</b>
                            </button>
                        </div>
                    </div>
                    <div id='my-body-div'>
                        {
                            auctionData.map((element, index) => {
                                const auction_date = Number(element.date);
                                const timeString = element.time;

                                if (isNaN(auction_date)) {
                                    console.log("Invalid Date:", element.date);
                                }

                                const dateObj = new Date(auction_date);
                                const day = dateObj.getDate().toString().padStart(2, '0');
                                const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                const year = dateObj.getFullYear();
                                const formattedDate = `${day}-${month}-${year}`;

                                return (
                                    <div className='auction-div' key={index}>
                                        <div className='auction-div-head' onClick={() => handleStartAction(element, index)}>
                                            <h1>{element.auction_name}</h1>
                                            <div>
                                                <time dateTime={dateObj.toISOString()}>{formattedDate}   {timeString}</time>
                                            </div>
                                        </div>
                                        <div className='auction-div-body'>
                                            <div>
                                                <p>Base Bid: {element.base_bit}</p>
                                                <p>Bid Increment: {element.bit_increse_by}</p>
                                            </div>
                                            <div>
                                                <p>Max Player: {element.max_player}</p>
                                                <p>Min Player: {element.min_player}</p>
                                            </div>
                                        </div>
                                        <div className='auction-div-footer'>
                                            <div>
                                                <p><GrGroup size={25} title='add teams' style={{ cursor: "pointer" }} onClick={() => handleTeam(index, element)} /></p>
                                                <p><GiBabyfootPlayers size={25} title='add players' style={{ cursor: "pointer" }} onClick={() => handlePlayer(index, element)} /></p>
                                            </div>
                                            <div>
                                                {/* {
                                                    showButton && !completedAuctions[element.auction_id] && (
                                                        <p>
                                                            <AiFillEdit size={25} title='edit' style={{ cursor: "pointer", color: "#008000" }}
                                                                onClick={() => { handleEdit(index, element) }} />
                                                        </p>

                                                    )
                                                } */}
                                                <p>
                                                    <AiFillEdit size={25} title='edit' style={{ cursor: "pointer", color: "#008000" }}
                                                        onClick={() => { handleEdit(index, element) }} />
                                                </p>

                                                <p>
                                                    <MdDeleteForever size={25} title='delete' style={{ cursor: "pointer", color: "#FF0000" }}
                                                        onClick={() => { handleDelete(index, element.auction_id) }} />
                                                </p>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyAuction
