import React, { createContext, useState } from 'react'
import { NavBar } from '../components/NavBar/NavBar';
import Router from '../Routes/Routes';
import { ToastContainer } from 'react-toastify';


export const GlobalContext = createContext();

const GlobalProvider = () => {
    const [auction, setAuction] = useState(null);
    const [teamAuction, setTeamAuction] = useState(null);
    const [playerAuction, setPlayerAuction] = useState(null);
    const [user, setUser] = useState(null);
    const [auctionPanal, setAuctionPanal] = useState(null);

    return (
        <>
            <ToastContainer />
            <GlobalContext.Provider value={{ auction, setAuction, teamAuction, setTeamAuction, playerAuction, setPlayerAuction, user, setUser, auctionPanal, setAuctionPanal }}>
                <NavBar/>
                <Router/>
            </GlobalContext.Provider>
        </>
    );
};

export default GlobalProvider;