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
    const [teamId, setTeamId] = useState(0)
    const [active, setActive] = useState(0)
    const theme = {
        background: "#E5E7EB",
        text: "#132E35",
        primary: "#0D4D4D",
        cardBg: "#FFFFFF",
        cardText: "#132E35",
        hoverBg: "#1b464b",
    };

    return (
        <>
            <ToastContainer />
            <GlobalContext.Provider value={{ active, setActive, auction, setAuction, teamAuction, setTeamAuction, playerAuction, setPlayerAuction, user, setUser, auctionPanal, setAuctionPanal, teamBudget, setTeamBudget, teamId, setTeamId, theme }}>
                <NavBar />
                <Router />
            </GlobalContext.Provider>
        </>
    );
};

export default GlobalProvider;