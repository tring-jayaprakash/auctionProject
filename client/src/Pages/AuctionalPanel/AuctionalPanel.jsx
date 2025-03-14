import React, { useContext, useEffect, useState } from 'react'
import './AuctionalPanel.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../context/GlobalContext'



const AuctionalPanel = () => {

    const navigator = useNavigate()

    const { auctionPanal, setAuctionPanal } = useContext(GlobalContext)
    const [start, setStart] = useState(true)
    const [startAuction, setStartAuction] = useState([]) //fetchAuction
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



    useEffect(() => {
        let storedPanel = localStorage.getItem("AuctionPanel")
        console.log(storedPanel);

        if (storedPanel) {
            const storedAuction = JSON.parse(storedPanel)
            console.log(storedAuction);
            setAuctionPanal(storedAuction)
            setBidIncrese(storedAuction.base_bit);

            console.log(storedAuction);
            // console.log(!onePlayer);
        }


    }, [])


    useEffect(() => {

        if (!auctionPanal) return;

        localStorage.setItem("AuctionPanel", JSON.stringify(auctionPanal))
        console.log(auctionPanal.auction_id);
        const id = Number(auctionPanal.auction_id)

        async function fetchAuction() {
            if (!id) return
            const query = `
                        query{
                          getAuctionByauction_id(auction_id:${id}){
                            auction_id
                            logo
                            sports
                            auction_name
                            date
                            time
                            base_bit
                            bit_increse_by
                            max_player
                            min_player
                            user_id
                          }
                        }     
                    `
            try {
                const response = await axios.post("http://localhost:2500/graphql", { query })
                const condetion = response.data.data.getAuctionByauction_id
                console.log(condetion);
                // setStartAuction(condetion)
            } catch (error) {
                console.log(error.message)
            }
        }

        async function fetchTeams() {
            if (!id) return;
            const query = `
                query {
                    getTeamsByAuction(auction_id: ${id}) {
                        team_id
                        team_logo
                        team_name
                        team_short_name
                        auction_id
                        budget
                        total_budget
                    }
                }
            `

            try {
                const response = await axios.post("http://localhost:2500/graphql", { query })

                if (response.data.errors) {
                    toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 })
                    return;
                }
                console.log(response.data.data.getTeamsByAuction);

                setAuctionTeam(response.data.data.getTeamsByAuction)
            } catch (error) {
                console.error("Error fetching teams:", error)
                toast.error("Failed to fetch teams.", { position: "top-right", autoClose: 2000 })
            }
        }


        async function fetchPlayers() {
            if (!id) return;
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
                const response = await axios.post("http://localhost:2500/graphql", { query });

                if (response.data.errors) {
                    toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                    return;
                }
                console.log(response.data.data.getPlayersByAuction);
                setAuctionPlayer(response.data.data.getPlayersByAuction);
            } catch (error) {
                console.error("Error fetching players:", error);
                toast.error("Failed to fetch players.", { position: "top-right", autoClose: 2000 });
            }
        }

        async function fetchPlayersWithTeam() {
            if (!id) return;
            const query = `
                query{
                    getPlayersByAuctionTeamNull(auction_id:${id})
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
                const response = await axios.post("http://localhost:2500/graphql", { query });

                if (response.data.errors) {
                    toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                    return;
                }
                console.log(response.data.data.getPlayersByAuctionTeamNull);
                setPlayerWithNull(response.data.data.getPlayersByAuctionTeamNull)
            } catch (error) {
                console.error("Error fetching players:", error);
                toast.error("Failed to fetch players.", { position: "top-right", autoClose: 2000 });
            }
        }


        fetchPlayers();
        fetchTeams()
        fetchAuction()
        fetchPlayersWithTeam()

    }, [auctionPanal])


    useEffect(() => {
        // console.log(count);
        if (count == 1) {
            if (!auctionTeam) return;
            console.log(auctionTeam);
            setBudget(auctionPlayer[count].budget)
            console.log(playerWithNull);

        }
    }, [count])


    const handleName = (element, index) => {
        if (start) return

        // setBitCheck

        setBitCheck(element.team_short_name)

        if (bidCheck == element.team_short_name) return

        setTeamName(element.team_short_name)
        setTeamIndex(element.team_id)
        setBidIncrese((prevBid) => prevBid + auctionPanal.bit_increse_by);


        // setBitCheck((prevBid)=> prevBid == element.team_short_name ) return
        // console.log(bidIncrese);

    }


    const handleStart = () => {
        if (!auctionPanal) {
            toast.error("There is no Auction active yet..!", { position: "top-right", autoClose: 1000 });
            return
        }

        toast.success("Auction Started Successfully", { position: "top-right", autoClose: 1000 });
        setStart(false);
        setBidIncrese(auctionPanal.base_bit);
        setTeamName("");

        // if (!auctionPlayer[count]) {
        if (!playerWithNull[count]) {
            toast.info("No more players available", { position: "top-right", autoClose: 2000 });
            return;
        }

        setOnePlayerNull(playerWithNull[count]) //__________________________
        setOnePlayer(playerWithNull[count]) //__________________________
        // setOnePlayer(auctionPlayer[count]);
        setCount(count + 1);
    };

    const handleEnd = () => {
        setAuctionPanal(null)
        localStorage.removeItem("AuctionPanel")
        navigator('/Dashboard/MyAuction')
    }


    const handleSold = () => {
        // if (start) return;

        if (bidIncrese > auctionPanal.base_bit) {
            setTeamName("")
            if (!auctionPlayer[count - 1]) {
                // if (!playerWithNull[count]) {
                toast.info("Auction ended successfully", { position: "top-right", autoClose: 2000 });
                return;
            }

            const playerWithTeam = auctionPlayer.find(player => player.team_id);
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
                    const response = await axios.post("http://localhost:2500/graphql", { query });

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
                    const response = await axios.post("http://localhost:2500/graphql", { query });

                    if (response.data.errors) {
                        toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                        return;
                    }
                    console.log("Budget updated:", response.data);
                    toast.success("Budget updated successfully!", { position: "top-right", autoClose: 1000 });
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

                                        <h1>Auction Name : {auctionPanal.auction_name}</h1>

                                    </div>

                                    {!start &&
                                        <>
                                            {

                                                !onePlayer.team_id &&
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
                                                                            !onePlayer.team_id &&
                                                                            <>
                                                                                <p>Player Name : {onePlayer.player_name}</p>
                                                                                <p>Player Style : {onePlayer.player_style}</p>
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
                                                                                    <th id='item' key={index} onClick={() => handleName(element, index)}>{element.team_short_name}</th>
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
                                    const playerCount = auctionPlayer.filter(player => player.team_id === teamElement.team_id).length;
                                    return (
                                        <div key={index}>
                                            <h3 style={{ textAlign: "center", borderBottom: "1px solid black", marginBottom: "5px", paddingBottom: "5px" }}>{teamElement.team_name}</h3>
                                            <p>player count : {playerCount}</p>
                                            <p>Balance : <span style={{ fontWeight: "bolder" }}> {teamElement.budget}</span></p>
                                            <h4>total Budget : {teamElement.total_budget}</h4>
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