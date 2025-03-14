import React, { createContext, useState } from 'react'
import { NavBar } from '../Pages/NavBar/NavBar';
import Router from '../Routes/Routes';
import { ToastContainer } from 'react-toastify';


export const GlobalContext = createContext();

const GlobalProvider = () => {
    const [auction, setAuction] = useState(null);
    const [teamAuction, setTeamAuction] = useState(null);
    const [playerAuction, setPlayerAuction] = useState(null);
    const [user, setUser] = useState(null);
    const [auctionPanal, setAuctionPanal] = useState(null);
    const [teamBudget, setTeamBudget] = useState(0)

    return (
        <>
            <ToastContainer />
            <GlobalContext.Provider value={{ auction, setAuction, teamAuction, setTeamAuction, playerAuction, setPlayerAuction, user, setUser, auctionPanal, setAuctionPanal, teamBudget, setTeamBudget }}>
                <NavBar />
                <Router />
            </GlobalContext.Provider>
        </>
    );
};

export default GlobalProvider;