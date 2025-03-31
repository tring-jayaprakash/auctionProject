import React, { useContext, useEffect, useState } from 'react'
import './AuctionalPanel.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../context/GlobalContext'
import { gql, useLazyQuery, useQuery } from '@apollo/client'

const GET_AUCTION_BY_AUCTION_ID = gql`
query MyQuery($auctionId: Int = 0) {
  allAuctions(condition: {auctionId: $auctionId}) {
    edges {
      node {
        auctionId
        auctionName
        auctionStatus
        baseBid
        bidIncreaseBy
        date
        maxPlayer
        minPlayer
      }
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
            console.log(formattedPlayers);
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

    // useEffect(() => {
    //     let storedPanel = localStorage.getItem("AuctionPanel")
    //     console.log(storedPanel);
    //     if (storedPanel) {
    //         const storedAuction = JSON.parse(storedPanel)
    //         console.log(storedAuction);
    //         setAuctionPanal(storedAuction)
    //         setBidIncrese(storedAuction.base_bit);
    //         console.log(storedAuction);
    //     }
    // }, [])

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
            console.log(dta);
        }
    }, [auctionPanal]);

    // useEffect(() => {

    //     if (!auctionPanal) return;

    //     // localStorage.setItem("AuctionPanel", JSON.stringify(auctionPanal))
    //     console.log(auctionPanal.auctionId);
    //     const id = Number(auctionPanal.auction_id)

    //     async function fetchAuction() {
    //         if (!id) return
    //         const query = `
    //                     query{
    //                       getAuctionByauction_id(auction_id:${id}){
    //                         auction_id
    //                         logo
    //                         sports
    //                         auction_name
    //                         date
    //                         time
    //                         base_bit
    //                         bit_increse_by
    //                         max_player
    //                         min_player
    //                         user_id
    //                       }
    //                     }     
    //                 `
    //         try {
    //             const response = await axios.post(url, { query })
    //             const condetion = response.data.data.getAuctionByauction_id
    //             console.log(condetion);
    //         } catch (error) {
    //             console.log(error.message)
    //         }
    //     }

    //     async function fetchTeams() {
    //         if (!id) return;
    //         const query = `
    //             query {
    //                 getTeamsByAuction(auction_id: ${id}) {
    //                     team_id
    //                     team_logo
    //                     team_name
    //                     team_short_name
    //                     auction_id
    //                     budget
    //                     total_budget
    //                 }
    //             }
    //         `

    //         try {
    //             const response = await axios.post(url, { query })

    //             if (response.data.errors) {
    //                 toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 })
    //                 return;
    //             }
    //             console.log(response.data.data.getTeamsByAuction);

    //             setAuctionTeam(response.data.data.getTeamsByAuction)
    //         } catch (error) {
    //             console.error("Error fetching teams:", error)
    //             toast.error("Failed to fetch teams.", { position: "top-right", autoClose: 2000 })
    //         }
    //     }


    //     async function fetchPlayers() {
    //         if (!id) return;
    //         const query = `
    //             query{
    //                 getPlayersByAuction(auction_id:${id})
    //                 {
    //                     player_id
    //                     player_pic
    //                     player_name
    //                     father_name
    //                     player_ph_number
    //                     age
    //                     form_number
    //                     player_style
    //                     team_id
    //                 }
    //             }
    //         `

    //         try {
    //             const response = await axios.post(url, { query });

    //             if (response.data.errors) {
    //                 toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
    //                 return;
    //             }
    //             console.log(response.data.data.getPlayersByAuction);
    //            setAuctionPlayer(response.data.data.getPlayersByAuction);
    //         } catch (error) {
    //             console.error("Error fetching players:", error);
    //             toast.error("Failed to fetch players.", { position: "top-right", autoClose: 2000 });
    //         }
    //     }

    //     async function fetchPlayersWithTeam() {
    //         if (!id) return;
    //         const query = `
    //             query{
    //                 getPlayersByAuctionTeamNull(auction_id:${id})
    //                 {
    //                     player_id
    //                     player_pic
    //                     player_name
    //                     father_name
    //                     player_ph_number
    //                     age
    //                     form_number
    //                     player_style
    //                     team_id
    //                 }
    //             }
    //         `

    //         try {
    //             const response = await axios.post(url, { query });

    //             if (response.data.errors) {
    //                 toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
    //                 return;
    //             }
    //             console.log(response.data.data.getPlayersByAuctionTeamNull);
    //             setPlayerWithNull(response.data.data.getPlayersByAuctionTeamNull)
    //         } catch (error) {
    //             console.error("Error fetching players:", error);
    //             toast.error("Failed to fetch players.", { position: "top-right", autoClose: 2000 });
    //         }
    //     }


    //     fetchPlayers();
    //     fetchTeams()
    //     fetchAuction()
    //     fetchPlayersWithTeam()

    // }, [auctionPanal])

    useEffect(() => {
        if (count == 1) {
            if (!auctionTeam) return;
            console.log(auctionTeam);
            setBudget(auctionPlayer[count].budget)
            console.log(playerWithNull);

        }
    }, [count])

    const handleName = (element, index) => {
        // if (start) return
        if (count == 0) return
        // console.log(count);
        
        
        setBitCheck(element.teamShortName)
        if (bidCheck == element.teamShortName) return
        // if (bidCheck > auctionTeam.totalBudget) return
        setTeamName(element.teamShortName)
        setTeamIndex(element.teamId)
        // console.log(auctionPanalAuction);
        setBidIncrese((prevBid) => prevBid + auctionPanalAuction.bidIncreaseBy);
    }


    const handleStart = async () => {
        // const teams = await getTeams({ variables: { auctionAuctionId: auctionPanal.auctionId } });
        // const sTeam = teams.data.allTeams.edges.map((m)=>m.node)
        // console.log(sTeam);
        // setAuctionTeam(sTeam);

        if (!auctionPanal) {
            toast.error("There is no Auction active yet..!", { position: "top-right", autoClose: 1000 });
            return
        }

        toast.success("Auction Started Successfully", { position: "top-right", autoClose: 1000 });
        setStart(false);
        setBidIncrese(auctionPanalAuction.bidIncreaseBy);
        // console.log(auctionPanalAuction.bidIncreaseBy);
        
        setTeamName("");

        if (!playerWithNull[count]) {
            toast.info("No more players available", { position: "top-right", autoClose: 2000 });
            return;
        }

        setOnePlayerNull(playerWithNull[count])
        setOnePlayer(playerWithNull[count])
        setCount(count + 1);
    };

    const handleEnd = () => {
        setAuctionPanal(null)


        async function updateAuctionStatus(auction_id, auction_status) {
            const query = `
            mutation {
                updateAuctionStatus(auction_id: ${Number(auction_id)}, auction_status: "${auction_status}")
                }
                `;

            try {
                const response = await axios.post(url, { query });

                if (response.data.errors) {
                    toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                    return;
                }

                console.log("Auction status updated:", response.data);
                toast.success("Auction status updated successfully!", { position: "top-right", autoClose: 2000 });
            } catch (error) {
                console.error("Error updating auction status:", error);
                toast.error("Failed to update auction status. Please try again.", { position: "top-right", autoClose: 2000 });
            }
        }


        updateAuctionStatus(auctionPanal.auction_id, "completed")

        console.log(auctionPanal.auction_id);

        navigator('/Dashboard/MyAuction')
    }

    const handleSold = () => {

        if (bidIncrese > auctionPanal.baseBid) {
            setTeamName("")
            if (!auctionPlayer[count - 1]) {
                toast.info("Auction ended successfully", { position: "top-right", autoClose: 2000 });
                return;
            }

            setBitCheck("")

            const playerWithTeam = auctionPlayer.find(player => player.teamId);
            console.log(playerWithTeam)
            console.log(playerWithTeam)

            const prevPlayer = auctionPlayer[count - 1];


            const updatedPlayers = auctionPlayer.map(player =>
                player.player_id === auctionPlayer[count - 1].player_id
                    ? { ...player, team_id: teamIndex }
                    : player
            );
            setAuctionPlayer(updatedPlayers);
            setPlayerWithNull(updatedPlayers)



            if (auctionPlayer[count]) {
                setOnePlayer(playerWithNull[count])
                setCount(prevCount => prevCount + 1);
                setBidIncrese(auctionPanal.base_bit);
            } else {
                toast.info("No more players left", { position: "top-right", autoClose: 2000 });
                setEndAuction(false)
            }

            async function updatePlayerForTeam() {
                const query = `
                mutation {
                    updatePlayerForTeam(player_id:${Number(prevPlayer.player_id)}, team_id:${Number(teamIndex)}, bid_amount:${bidIncrese})
                }
                `;
                try {
                    const response = await axios.post(url, { query });

                    if (response.data.errors) {
                        toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                        return;
                    }
                    console.log("Player assigned to team:", response.data);
                } catch (error) {
                    console.error("Error updating player:", error);
                    toast.error("Failed to update player. Please try again.", { position: "top-right", autoClose: 2000 });
                }
            }

            async function updateTeamBudgetByTeamId() {
                const query = `
                mutation {
                    updateTeamBudgetByTeamId(team_id:${Number(teamIndex)}, budget:${bidIncrese})
                }
                `;
                try {
                    const response = await axios.post(url, { query });

                    if (response.data.errors) {
                        toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                        return;
                    }
                    console.log("Budget updated:", response.data);
                    toast.success("player sold out successfully!", { position: "top-right", autoClose: 1000 });
                } catch (error) {
                    console.error("Error updating budget:", error);
                    toast.error("Failed to update budget. Please try again.", { position: "top-right", autoClose: 2000 });
                }
            }

            setAuctionTeam(prevTeams =>
                prevTeams.map(team =>
                    team.team_id === teamIndex
                        ? { ...team, budget: team.budget - bidIncrese }
                        : team
                )
            );




            updatePlayerForTeam();
            updateTeamBudgetByTeamId();
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
                                                                    <button style={{ backgroundColor: "lightsalmon" }} onClick={() => handleStart()}><b> Unsold </b></button>
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
                                    const playerCount = auctionPlayer.filter(player => player.team_id === teamElement.teamId).length;
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
                    {/* } */}
                </div>
            </div>
        </>
    )
}

export default AuctionalPanel