import React, { useContext, useEffect, useState } from 'react'
import './AuctionalPanel.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../context/GlobalContext'



const AuctionalPanel = () => {

    const navigator = useNavigate()

    const {auction, setAuction, teamAuction, setTeamAuction, playerAuction, setPlayerAuction, user, setUser, auctionPanal, setAuctionPanal} = useContext(GlobalContext)
    const [start, setStart] = useState(true)
    const [startAuction, setStartAuction] = useState([])
    const [auctionTeam, setAuctionTeam] = useState([])
    const [auctionPlayer, setAuctionPlayer] = useState([])
    const [teamName, setTeamName] = useState("")
    const [onePlayer, setOnePlayer] = useState([])
    const [count, setCount] = useState(0)
    const [teamIndex, setTeamIndex] = useState(0)
    const [budget, setBudget] = useState(0)
    const [bidIncrese, setBidIncrese] = useState(0)


    useEffect(() => {
        let storedPanel = localStorage.getItem("AuctionPanel")
        if (storedPanel) {
            const storedAuction = JSON.parse(storedPanel)
            console.log(storedAuction);
            setAuctionPanal(storedAuction)
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
                setStartAuction(condetion)
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

        fetchPlayers();
        fetchTeams()
        fetchAuction()
    }, [auctionPanal])

    const handleName = (element, index) => {
        // console.log(auctionPanal.bit_increse_by)
        if (start) return
        const nmae = element.team_short_name
        setTeamName(nmae)


        setBidIncrese(bidIncrese + auctionPanal.bit_increse_by)
        setTeamIndex(element.team_id)


        console.log(bidIncrese + auctionPanal.bit_increse_by);
        console.log(element.team_id);
    }

    const handleStart = () => {
        toast.success("Auction Started Sucessfully", { position: "top-right", autoClose: 1000 })
        setStart(false)
        setBidIncrese(auctionPanal.base_bit)
        setTeamName("")
        // console.log(auctionPlayer[count])
        if (!auctionPlayer[count]) return
        setOnePlayer(auctionPlayer[count])
        setCount(count + 1)
        // console.log(count);
    }

    const handleEnd = () => {
        navigator('/Dashboard/MyAuction')
    }


    const handleSold = () => {
        if (start) return

        if (bidIncrese > auctionPanal.base_bit) {

            setTeamName("")
            if (!auctionPlayer[count]) return
            setOnePlayer(auctionPlayer[count])
            setCount(count + 1)
            setBidIncrese(auctionPanal.base_bit)

            console.log(bidIncrese);
            console.log(teamIndex);
            console.log(auctionPlayer[count - 1].player_id);

            async function updatePlayerForTeam() {
                const query = `
            mutation{
                updatePlayerForTeam(player_id:${Number(auctionPlayer[count - 1].player_id)},team_id:${Number(teamIndex)},bid_amount:${bidIncrese})
            }
            `
                try {
                    const response = await axios.post("http://localhost:2500/graphql", { query });

                    console.log("Response:", response.data);

                    if (response.data.errors) {
                        toast.error(response.data.errors[0].message, { position: "top-right", autoClose: 2000 });
                        return;
                    }
                    toast.success(response.data.data.updatePlayerForTeam, { position: "top-right", autoClose: 1000 });
                } catch (error) {
                    console.error("Auction creation error:", error);
                    toast.error("Failed to add auction. Please try again.", { position: "top-right", autoClose: 2000 });
                }
            }

            updatePlayerForTeam()
        } else {
            toast.error("error", { position: "top-right", autoClose: 2000 })
        }

    }
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
                            {start ? (
                                <button id='add-btt' onClick={() => handleStart()}>
                                    <b>Start Auction</b>
                                </button>
                            ) : (
                                <button id='add-btt' onClick={handleEnd}>
                                    <b>End Auction</b>
                                </button>
                            )}

                        </div>
                    </div>
                    {/* {!auctionPanal && */}
                        <div id='panel-body-div'>

                            <div id='body-div1'>
                                <div id='auction-name-div'>
                                    {auctionPanal ? (
                                        <h1>Auction Name : {auctionPanal.auction_name}</h1>
                                    ) : (
                                        <p>Loading auction data...</p>
                                    )}

                                </div>
                                <div id='auction-player-div'>
                                    <div id='auction-player-inner-div'>
                                        <div id='player-head'>
                                            <div id='player-img-div'>
                                                <img src="https://superplayerauction.com/images/noimage.jpg?a=48377" alt="" />
                                            </div>
                                            <div id='player-content-div'>
                                                <p>Player No : {count}</p>
                                                <p>Player Name : {onePlayer.player_name}</p>
                                                <p>Player Style : {onePlayer.player_style}</p>
                                            </div>
                                        </div>
                                        <div id='auction-control-panal'>
                                            <div id='bit_teamName'>

                                                <div>
                                                    {auctionPanal ? (
                                                        <h2>Bit :{bidIncrese} </h2>
                                                    ) : (
                                                        <p>Loading auction data...</p>
                                                    )}
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
                                </div>
                            </div>
                            <div id='body-div2'>
                                {auctionPanal &&
                                    auctionTeam.map((teamElement, index) => (
                                        <div key={index}>
                                            <h3 style={{ textAlign: "center" }}>{teamElement.team_name}</h3>
                                            <p>player count : 0</p>
                                            <h2>total Budget : {!start && teamElement.budget}</h2>
                                        </div>
                                    ))
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