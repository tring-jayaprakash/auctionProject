import React, { useContext, useEffect, useState } from 'react'
import { GrGroup } from "react-icons/gr";
import { GiBabyfootPlayers } from "react-icons/gi";
import { AiFillEdit } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import './MyAuction.css'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GlobalContext } from '../../context/GlobalContext';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { DELETE_AUCTION, FETCH_AUCTION_BY_USER_ID, UPDATE_TEAM_TOTAL_BUDGET } from '../../../graphql/mutation/userMutation';
import { ALL_AUCTION_PLAYER, GET_TEAM_BY_AUCTION_ID } from '../../../graphql/query/userQuery';


const MyAuction = () => {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const { user, setUser, auction, setAuction, teamAuction, setTeamAuction, playerAuction, setPlayerAuction, auctionPanal, setAuctionPanal ,teamId, setTeamId } = useContext(GlobalContext)
    const navigater = useNavigate()
    const [auctionData, setAuctionData] = useState([])
    const [getTeams, { loading: teamLoding, error: teamError, data: teamData }] = useLazyQuery(GET_TEAM_BY_AUCTION_ID);
    const [getPlayers, { loading: playerLoding, error: playerError, data: playerData }] = useLazyQuery(ALL_AUCTION_PLAYER);
    const [updateTeamBudget] = useMutation(UPDATE_TEAM_TOTAL_BUDGET, {
        context: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    })
    const [deleteAuctionById, { data, loading, error }] = useMutation(DELETE_AUCTION, {
        context: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        },
        fetchPolicy: "no-cache"
    })

    const { data: fetchedData, loading: auctionLoading, error: auctionError } = useQuery(FETCH_AUCTION_BY_USER_ID, {
        variables: { creatorUserId: user?.user_id },
        context: {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        },
        fetchPolicy: "no-cache"
    });

    useEffect(() => {
        if (fetchedData) {
            setAuctionData(fetchedData.allAuctions.edges.map(edge => edge.node));
        }
    }, [fetchedData]);

    // useEffect(()=>{
    // },[])

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
        setPlayerAuction(element)
        setTeamId(0 )
        navigater('/Dashboard/MyAuction/Player')
    }

    const handleStartAction = async (element, index) => {
        try {
            if (element.auctionStatus == "COMPLETED") return toast.dark("This auction have completed already", { position: "top-right", autoClose: 2000 })

            const teams = await getTeams({ variables: { auctionAuctionId: element.auctionId } });
            const teamsList = teams?.data?.allTeams?.edges?.map(edge => edge.node) || [];

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

            if (element.minPlayer * teamsList.length <= playersLength) {
                const budget = element.baseBid * teamsList.length * playersLength;
                const finalBudget = budget + (budget * 50 / 100);

                await Promise.all(
                    teamsList.map(async (team) => {
                        await updateTeamBudget({
                            variables: {
                                teamId: parseInt(team.teamId, 10),
                                budget: finalBudget,
                                balanceBudget: finalBudget
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
                                return (
                                    <div className='auction-div' key={index}>
                                        <div className='auction-div-head' title={element.auctionStatus === "PENDING" && 'Click to  Start the Auction' } onClick={() => handleStartAction(element, index)}>
                                            <div style={{ marginTop: "25px" }}>
                                                <h1>{element.auctionName}</h1>
                                            </div>
                                            <div>
                                                <time dateTime="">{element.date}--{element.time}</time>
                                            </div>
                                            <div>
                                                <p>
                                                    Auction State :
                                                    {element.auctionStatus === "PENDING" ? (
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
