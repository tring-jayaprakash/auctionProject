import React, { useState } from 'react'
import './DashBoard.css'
import SideNavbar from '../SideNavbar/SideNavbar'
import { Outlet } from 'react-router-dom'
import { IoReorderThree } from "react-icons/io5";

export const DashBoard = () => {
    const [menuFlage, setMenuFlage] = useState(true)
    const handleMenu = () => {
        menuFlage ? setMenuFlage(false) : setMenuFlage(true);
    }


    return (
        <>
            <div id='dashboard-maindiv'>
                {/* <button onClick={handleMenu} id='nav-btn'><IoReorderThree size={30} /></button> */}
                <div id='sub-div'>
                    {menuFlage && <SideNavbar />}
                    <Outlet />
                </div>
            </div>
        </>
    )
}
