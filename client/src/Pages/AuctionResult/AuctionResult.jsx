
import React, { useContext, useEffect, useState } from 'react'
import './AuctionResult.css'
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalContext';
import { gql, useQuery } from '@apollo/client';
import { GrGroup } from 'react-icons/gr';
import { GiBabyfootPlayers } from 'react-icons/gi';

const FETCH_ALL_AUCTION = gql`
query  {
  allAuctions {
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

const AuctionResult = () => {
    const url = import.meta.env.VITE_GRAPHQL_URL
    const { user, setUser, auction, setAuction, teamAuction, setTeamAuction, playerAuction, setPlayerAuction, auctionPanal, setAuctionPanal } = useContext(GlobalContext)
    const navigater = useNavigate()
    const [auctionData, setAuctionData] = useState([])

    const { data: fetchedData, loading: auctionLoading, error: auctionError } = useQuery(FETCH_ALL_AUCTION, {
        fetchPolicy: "no-cache"
    });

    useEffect(() => {
        if (fetchedData) {
            setAuctionData(fetchedData.allAuctions.edges.map(edge => edge.node));
        }
    }, [fetchedData]);


    const handleTeam = (index, element) => {
        setTeamAuction(element)
        navigater('/Reault/TeamResult')
    }
    const handlePlayer = (index, element) => {
        setPlayerAuction(element)
        navigater('/Reault/PlayerResult')
    }


    return (
        <>
            <div id='result-main-div'>
                <div id='result-inner-div'>
                    <div id='result-header-div'>
                        <div >
                            <h1>
                                My Auction
                            </h1>
                        </div>
                    </div>
                    <div id='my-body-div'>
                        {
                            auctionData.map((element, index) => {
                                if (element.auctionStatus === "COMPLETED") {
                                    return (
                                        <div className='auction-div' key={index}>
                                            <div className='auction-div-head' style={{cursor:"default"}}>
                                                <div style={{ marginTop: "25px" }}>
                                                    <h1>{element.auctionName}</h1>
                                                </div>
                                                <div>

                                                    <time dateTime="">{element.date}--{element.time}</time>
                                                </div>
                                                <div>
                                                    <p>
                                                        Auction State :
                                                        <b style={{ color: "green" }}>{" " + element.auctionStatus}</b>
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
                                            </div>
                                        </div>
                                    );
                                }
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default AuctionResult

