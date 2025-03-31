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
import { GET_AUCTION_BY_USER } from '../../../graphql/query/userQuery';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';

const FETCH_AUCTION_BY_USER_ID = gql`
query user($creatorUserId: Int!) {
  allAuctions(condition: {creatorUserId: $creatorUserId}) {
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
const deleteAuction = gql`
mutation MyMutation($auctionId: Int = 0)  {
  deleteAuctionByAuctionId(input: {auctionId: $auctionId}) {
    auction {
      auctionId
      auctionName
      auctionStatus
      baseBid
      bidIncreaseBy
      creatorUserId
      date
      maxPlayer
      minPlayer
      nodeId
      sportsType
      time
    }
  }
}
`
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
const ALL_AUCTION_PLAYER = gql`
query MyQuery($auctionAuctionId: Int = 0) {
  allPlayers(condition: {auctionAuctionId: $auctionAuctionId}) {
    edges {
      node {
        playerAge
        playerId
        playerName
        playerPhoneNumber
        playerStyle
      }
    }
  }
}
`
const UPDATE_TEAM_TOTAL_BUDGET = gql`
mutation UpdateTeamByTeamId($teamId: Int!, $budget: Int!) {
  updateTeamByTeamId(input: { teamId: $teamId, teamPatch: { totalBudget: $budget } }) {
    team {
      teamId
      teamName
      teamShortName
      totalBudget
    }
  }
}
`

const MyAuction = () => {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const { user, setUser, auction, setAuction, teamAuction, setTeamAuction, playerAuction, setPlayerAuction, auctionPanal, setAuctionPanal } = useContext(GlobalContext)
    const navigater = useNavigate()
    const [auctionData, setAuctionData] = useState([])
    const [showButton, setShowButton] = useState(true)
    const [getTeams, { loading: teamLoding, error: teamError, data: teamData }] = useLazyQuery(GET_TEAM_BY_AUCTION_ID);
    const [getPlayers, { loading: playerLoding, error: playerError, data: playerData }] = useLazyQuery(ALL_AUCTION_PLAYER);
    const [updateTeamBudget] = useMutation(UPDATE_TEAM_TOTAL_BUDGET)
    const [deleteAuctionById, { data, loading, error }] = useMutation(deleteAuction, {
        context: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
        fetchPolicy:"no-cache"
    })
    
    const { data: fetchedData, loading: auctionLoading, error: auctionError } = useQuery(FETCH_AUCTION_BY_USER_ID, {
        variables: { creatorUserId: user?.user_id },
        context: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        },
        fetchPolicy:"no-cache"
    });

    useEffect(() => {
        if (fetchedData) {
            setAuctionData(fetchedData.allAuctions.edges.map(edge => edge.node));
        }
    }, [fetchedData]);

    const handleDelete = async (index, id) => {

        try {
            const res = await deleteAuctionById({ variables: { auctionId: id } });
            if (res.data) {
                setAuctionData((prev) => prev.filter((auction) => auction.auctionId !== id));
                toast.success("Auction Deleted Successfully!", { position: "top-right", autoClose: 1000 });
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Issue in deleting Auction", { position: "top-right", autoClose: 2000 });
        }

    }

    const handleEdit = (index, element) => {
        setAuction(element)
        navigater('/Dashboard/NewAuction')
    }

    const handleTeam = (index, element) => {
        setTeamAuction(element)
        navigater('/Dashboard/MyAuction/Team')
    }
    const handlePlayer = (index, element) => {
        // console.log(index);
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
        try {
            const response = await axios.post(url, { query });

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
                        bid_amount
                    }
                }
            `;

        try {
            const response = await axios.post(url, { query });

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

    // async function updateTeamBudget(element, finalBudget) {
    //     const query = `
    //         mutation{
    //         updateTeamBudget(auction_id:${element.auction_id},budget:${finalBudget},total_budget:${finalBudget})
    //         }
    //         `
    //     try {
    //         const response = await axios.post(url, { query });

    //         if (response.data.errors) {
    //             toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
    //             return [];
    //         }
    //         console.log("Fetched Players:", response.data.data.updateTeamBudget);
    //     } catch (error) {
    //         console.error("Error fetching players:", error);
    //         toast.error("Failed to fetch players.", { position: "top-right", autoClose: 2000 });
    //     }
    // }

    // const { data: fetchedTeam, loading, error } = useQuery(GET_TEAM_BY_AUCTION_ID, {
    //     fetchPolicy: "no-cache",
    //     skip: !teamAuction?.auctionId,
    //     variables: { auctionAuctionId: teamAuction?.auctionId || 0 }
    // });
    // console.log(fetchedTeam);

    const handleStartAction = async (element, index) => {
        try {

            const teams = await getTeams({ variables: { auctionAuctionId: element.auctionId } });
            const teamsList = teams?.data?.allTeams?.edges?.map(edge => edge.node) || [];
            console.log(teamsList);
            
            if (!teamsList.length) return toast.error("No teams found for this auction!", { position: "top-right", autoClose: 2000 });

            const players = await getPlayers({ variables: { auctionAuctionId: element.auctionId } })
            const playersLength = players?.data?.allPlayers?.edges?.length || 0;

            if (!playersLength) return toast.error("No players found for this auction!", { position: "top-right", autoClose: 2000 });

            const currentDate = new Date();
            const auctionDate = new Date(element.date);
            const [hours, minutes] = element.time.split(":").map(Number);
            auctionDate.setHours(hours, minutes, 0, 0);

            if (currentDate < auctionDate) {
                return toast.info("Auction can only start at the scheduled date and time!", { position: "top-right", autoClose: 2000 });
            }
            console.log(element.minPlayer);
            console.log(teamsList.length);
            console.log(playersLength);
            
            console.log(element.minPlayer * teamsList.length <= playersLength);
            
            if (element.minPlayer * teamsList.length <= playersLength) {
                const budget = element.baseBid * teamsList.length * playersLength;
                const finalBudget = budget + (budget * 50 / 100);

                await Promise.all(
                    teamsList.map(async (team) => {
                        await updateTeamBudget({
                            variables: {
                                teamId: parseInt(team.teamId, 10),
                                budget: finalBudget
                            }
                        });
                    })
                );

                setAuctionPanal({ ...element }); 
                navigater('/Dashboard/AuctionalPanel');
            } else {
                return toast.info("Not enough players found for this auction!", { position: "top-right", autoClose: 2000 });
            }
        } catch (error) {
            console.error("Error starting auction:", error);
            toast.error("Failed to start auction!", { position: "top-right", autoClose: 2000 });
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
                                    // console.log("Invalid Date:", element.date);
                                }

                                const dateObj = new Date(auction_date);
                                const day = dateObj.getDate().toString().padStart(2, '0');
                                const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                                const year = dateObj.getFullYear();
                                const formattedDate = `${day}-${month}-${year}`;

                                return (
                                    <div className='auction-div' key={index}>
                                        <div className='auction-div-head' title='Click to  Start the Auction' onClick={() => handleStartAction(element, index)}>
                                            <div style={{ marginTop: "25px" }}>
                                                <h1>{element.auctionName}</h1>
                                            </div>
                                            <div>
                                                {/* <time dateTime={dateObj.toISOString()}>{formattedDate}   {timeString}</time> */}
                                                <time dateTime="">{element.date}--{element.time}</time>
                                            </div>
                                            <div>
                                                <p>
                                                    Auction State :
                                                    {element.auctionStatus === "pending" ? (
                                                        <b style={{ color: "orange" }}>{" " + element.auctionStatus}</b>
                                                    ) : (
                                                        <b style={{ color: "green" }}>{" " + element.auctionStatus}</b>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className='auction-div-body'>
                                            <div>
                                                <p>Base Bid: {element.baseBid}</p>
                                                <p>Bid Increment: {element.bidIncreaseBy}</p>
                                            </div>
                                            <div>
                                                <p>Max Player: {element.maxPlayer}</p>
                                                <p>Min Player: {element.minPlayer}</p>
                                            </div>
                                        </div>
                                        <div className='auction-div-footer'>
                                            <div>
                                                <p><GrGroup size={25} title='add teams' style={{ cursor: "pointer" }} onClick={() => handleTeam(index, element)} /></p>
                                                <p><GiBabyfootPlayers size={25} title='add players' style={{ cursor: "pointer" }} onClick={() => handlePlayer(index, element)} /></p>
                                            </div>

                                            <div>
                                                {
                                                    element.auctionStatus == "PENDING" &&
                                                    <p>
                                                        <AiFillEdit size={25} title='edit' style={{ cursor: "pointer", color: "#008000" }}
                                                            onClick={() => { handleEdit(index, element) }} />
                                                    </p>
                                                }
                                                <p>
                                                    <MdDeleteForever size={25} title='delete' style={{ cursor: "pointer", color: "#FF0000" }}
                                                        onClick={() => { handleDelete(index, element.auctionId) }} />
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
