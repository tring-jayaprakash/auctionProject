import React, { useContext, useEffect, useState } from 'react'
import './AuctionalPanel.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../context/GlobalContext'
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { ALL_AUCTION_PLAYER, GET_ALL_AUCTION_PLAYER, GET_AUCTION_BY_AUCTION_ID, GET_TEAM_BY_AUCTION_ID } from '../../../graphql/query/userQuery'
import { CREATE_AUCTION_PLAYER, UPDATE_AUCTION_STATUS, UPDATE_PLAYER_BID_AMOUNT, UPDATE_TEAM_BALANCE_BUDGET } from '../../../graphql/mutation/userMutation'

const AuctionalPanel = () => {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const navigator = useNavigate()
    const location = useLocation();
    const { auctionPanal, setAuctionPanal } = useContext(GlobalContext)
    const [auctionPanalAuction, setAuctionPanalAuction] = useState(null)
    const [start, setStart] = useState(true)
    const [auctionTeam, setAuctionTeam] = useState([]) //fetchTeams
    const [auctionPlayer, setAuctionPlayer] = useState([]) //fetchPlayers
    const [playerWithNull, setPlayerWithNull] = useState([]) //fetchPlayersWithNull
    const [onePlayeraNull, setOnePlayerNull] = useState([])
    const [teamName, setTeamName] = useState("")
    const [onePlayer, setOnePlayer] = useState([])
    const [count, setCount] = useState(0)
    const [teamIndex, setTeamIndex] = useState(0)
    const [budget, setBudget] = useState(0)
    const [bidIncrese, setBidIncrese] = useState(0)
    const [endAuction, setEndAuction] = useState(true)
    const [bidCheck, setBitCheck] = useState("")
    const [forCount, setForCount] = useState([])
    const [updatePlayerBidAmount] = useMutation(UPDATE_PLAYER_BID_AMOUNT)
    const [createAuctionPlayer] = useMutation(CREATE_AUCTION_PLAYER)
    const [updateTeamBalanceBudget] = useMutation(UPDATE_TEAM_BALANCE_BUDGET)
    const [updateAuctionStatus] = useMutation(UPDATE_AUCTION_STATUS)
    const [allAuctionPlayers,{ data: allAuctionPlayersData }] = useLazyQuery(GET_ALL_AUCTION_PLAYER, {
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if (allAuctionPlayersData) {
            setForCount(allAuctionPlayersData.allAuctionPlayers.nodes);
        }
    }, [allAuctionPlayersData]);
    const { data: fetchedData, loading: auctionLoading, error: auctionError } = useQuery(GET_AUCTION_BY_AUCTION_ID,
        {
            variables: { auctionId: auctionPanal?.auctionId },
            fetchPolicy: "cache-and-network"
        }
    )
    const { loading: teamLoding, error: teamError, data: teamData } = useQuery(GET_TEAM_BY_AUCTION_ID,
        {
            variables: { auctionAuctionId: auctionPanal?.auctionId },
            fetchPolicy: "cache-and-network"
        }
    );

    const { data: fetchedPlayer, loading, error } = useQuery(ALL_AUCTION_PLAYER, {
        fetchPolicy: "no-cache",
        skip: !auctionPanal?.auctionId,
        variables: { auctionAuctionId: auctionPanal?.auctionId || 0 }
    });

    useEffect(() => {
        if (fetchedPlayer?.allPlayers) {
            const formattedPlayers = fetchedPlayer.allPlayers.edges.map(edge => edge.node);
            setAuctionPlayer(formattedPlayers);
            setPlayerWithNull(formattedPlayers);
        }
    }, [fetchedPlayer]);

    useEffect(() => {
        if (teamData) {
            const dta = teamData.allTeams.edges.map((m) => m.node)
            setAuctionTeam(dta)
            // console.log(dta);
        }
    }, [teamData]);

    useEffect(() => {
        if (fetchedData) {
            const dta = fetchedData.allAuctions.edges.map((m) => m.node)
            setAuctionPanalAuction(dta[0])
        }
    }, [fetchedData]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const auctionIdFromUrl = params.get("auctionId");
        if (auctionIdFromUrl) {
            setAuctionPanal({ auctionId: parseInt(auctionIdFromUrl) });
        }
    }, []);

    useEffect(() => {
        if (auctionPanal?.auctionId) {
            navigator(`?auctionId=${auctionPanal.auctionId}`, { replace: true });
        }
        if (teamData) {
            const dta = teamData.allTeams.edges.map((m) => m.node)
            setAuctionTeam(dta)
        }
    }, [auctionPanal]);


    useEffect(() => {
        if (count == 1) {
            if (!auctionTeam) return;
            console.log(auctionTeam);
            setBudget(auctionPlayer[count].budget)
            // console.log(playerWithNull);

        }
    }, [count])

    const handleName = (element, index) => {
        // if (start) return
        if (bidIncrese == 0) {
            setBidIncrese(auctionPanalAuction.bidIncreaseBy)
        }
        if (count == 0) return


        setBitCheck(element.teamShortName)
        if (bidCheck == element.teamShortName) return
        // if (bidCheck > auctionTeam.totalBudget) return
        setTeamName(element.teamShortName)
        setTeamIndex(element.teamId)
        setBidIncrese((prevBid) => prevBid + auctionPanalAuction.bidIncreaseBy);
    }

    const handleUnsold = async () => {
        setBidIncrese(0)
        setStart(false);
        setTeamName("");
        if (!playerWithNull[count]) {
            toast.info("No more players available", { position: "top-right", autoClose: 2000 });
            return;
        }
        setOnePlayerNull(playerWithNull[count])
        setOnePlayer(playerWithNull[count])
        setCount(count + 1);
    }


    const handleStart = async () => {
        if (!auctionPanal) {
            toast.error("There is no Auction active yet..!", { position: "top-right", autoClose: 1000 });
            return
        }

        toast.success("Auction Started Successfully", { position: "top-right", autoClose: 1000 });
        setStart(false);

        setTeamName("");

        if (!playerWithNull[count]) {
            toast.info("No more players available", { position: "top-right", autoClose: 2000 });
            return;
        }

        setOnePlayerNull(playerWithNull[count])
        setOnePlayer(playerWithNull[count])
        setCount(count + 1);
    };

    const handleEnd = async () => {
        setAuctionPanal(null)

        const res = await updateAuctionStatus({
            variables: {
                auctionId: auctionPanal.auctionId,
                auctionStatus: "COMPLETED"
            }
        })
        console.log(res.data);
        console.log(auctionPanal.auctionId);

        navigator('/Dashboard/MyAuction')
    }

    const handleSold = async () => {
        if (bidIncrese >= auctionPanalAuction.baseBid) {
            setTeamName("")
            if (!auctionPlayer[count - 1]) {
                toast.info("Auction ended successfully", { position: "top-right", autoClose: 2000 });
                return;
            }

            const prevPlayer = auctionPlayer[count - 1];

            const updatePlayeRes = await updatePlayerBidAmount({
                variables: {
                    playerId: Number(prevPlayer.playerId),
                    playerBidAmount: Number(bidIncrese)
                }
            })

            const createAuctionPlayerResult = await createAuctionPlayer({
                variables:
                {
                    auctionAuctionId: auctionPanal?.auctionId,
                    playerPlayerId: Number(prevPlayer.playerId),
                    teamTeamId: Number(teamIndex)
                }
            })

            const updateTeamBalanceBudgetRes = await updateTeamBalanceBudget({
                variables: {
                    teamId: Number(teamIndex),
                    balanceBudget: Number(auctionTeam[0].totalBudget - Number(bidIncrese))
                }
            })
            await allAuctionPlayers();
            setBitCheck("")
            const updatedPlayers = auctionPlayer.map(player =>
                player.playerId === prevPlayer.playerId
                    ? { ...player, teamId: teamIndex }
                    : player
            );
            setAuctionPlayer(updatedPlayers);
            setPlayerWithNull(updatedPlayers)


            if (auctionPlayer[count]) {
                setOnePlayer(playerWithNull[count])
                setCount(prevCount => prevCount + 1);
                setBidIncrese(0)

            } else {
                toast.info("No more players left", { position: "top-right", autoClose: 2000 });
                setEndAuction(false)
            }


            setAuctionTeam(prevTeams =>
                prevTeams.map(team =>
                    team.teamId === teamIndex
                        ? { ...team, balanceBudget: team.balanceBudget - bidIncrese }
                        : team
                )
            );
        } else {
            toast.warn("Bid not started yet", { position: "top-right", autoClose: 2000 });
        }
    };


    return (
        <>
            <div id='panel-main-div'>
                <div id='panel-inner-div'>
                    <div id='panel-header-div'>
                        <div >
                            <h1>
                                Auctional Panel
                            </h1>
                        </div>
                        <div>
                            {
                                start ? (
                                    <button id='add-btt' onClick={() => handleStart()}>
                                        <b>Start Auction</b>
                                    </button>
                                ) : (
                                    <button id='add-btt' onClick={handleEnd}>
                                        <b>End Auction</b>
                                    </button>
                                )
                            }

                        </div>
                    </div>
                    <div id='panel-body-div'>

                        {auctionPanal ? (
                            <>

                                <div id='body-div1'>

                                    <div id='auction-name-div'>
                                        <h1>Auction Name : {auctionPanalAuction?.auctionName}</h1>
                                    </div>
                                    {!start &&
                                        <>
                                            {

                                                !onePlayer.teamId &&
                                                (<>

                                                    <div id='auction-player-div'>
                                                        {endAuction &&

                                                            <div id='auction-player-inner-div'>
                                                                <div id='player-head'>
                                                                    <div id='player-img-div'>
                                                                        <img src="https://superplayerauction.com/images/noimage.jpg?a=48377" alt="" />
                                                                    </div>
                                                                    <div id='player-content-div'>
                                                                        <p>Player No : {count}</p>
                                                                        {
                                                                            !onePlayer.teamId &&
                                                                            <>
                                                                                <p>Player Name : {onePlayer.playerName}</p>
                                                                                <p>Player Style : {onePlayer.playerStyle}</p>
                                                                            </>
                                                                        }

                                                                    </div>
                                                                </div>
                                                                <div id='auction-control-panal'>
                                                                    <div id='bit_teamName'>

                                                                        <div>
                                                                            {auctionPanal &&
                                                                                <h2>Bit : {bidIncrese}</h2>
                                                                            }
                                                                        </div>
                                                                        <div>
                                                                            <h2>{teamName}</h2>
                                                                        </div>
                                                                        <div id='forward'>
                                                                            {/* <button id='next_player' onClick={() => handleStart()}>Start</button> */}
                                                                            {/* <button id='next_player'>Backward</button> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div id='table-div'>
                                                                    <table id='team-table'>
                                                                        <thead>
                                                                            <tr>
                                                                                {auctionTeam.map((element, index) => (
                                                                                    <th id='item' key={index} onClick={() => handleName(element, index)}>{element.teamShortName}</th>
                                                                                ))
                                                                                }
                                                                            </tr>
                                                                        </thead>
                                                                    </table>
                                                                </div>
                                                                <div id='div_btn'>
                                                                    <button style={{ backgroundColor: "lightsalmon" }} onClick={() => handleUnsold()}><b> Unsold </b></button>
                                                                    <button style={{ backgroundColor: "lightgreen" }} onClick={() => handleSold()}><b> Sold </b></button>
                                                                </div>
                                                            </div>

                                                        }
                                                    </div>
                                                </>)
                                            }
                                        </>}
                                </div>
                            </>)
                            :
                            (
                                <>
                                    <p>...</p>
                                </>
                            )}
                        <div id='body-div2'>
                            {auctionPanal &&
                                auctionTeam.map((teamElement, index) => {
                                    const playerCount = forCount?.filter(player => Number(player.teamTeamId) === Number(teamElement.teamId)).length || 0;
                                    return (
                                        <div key={index}>
                                            <h3 style={{ textAlign: "center", borderBottom: "1px solid black", marginBottom: "5px", paddingBottom: "5px" }}>{teamElement.teamName}</h3>
                                            <p>player count : {playerCount}</p>
                                            <p>Balance : <span style={{ fontWeight: "bolder" }}> {teamElement.balanceBudget}</span></p>
                                            <h4>total Budget : {teamElement.totalBudget}</h4>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AuctionalPanel