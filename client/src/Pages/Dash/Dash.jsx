import React from 'react'
import { RiAuctionFill, RiAuctionLine } from "react-icons/ri";
import { IoIosTv } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import '../Dash/Dash.css'
import DashboardItem from '../../components/DashboardItem';

const Dash = () => {
    const navigater = useNavigate()
    return (
        <>
            <div id='main-div'>
                <div id='inner-div'>
                    <div id='header-div'>
                        <h1>
                            DASHBOARD
                        </h1>
                    </div>
                    <div id='body-div'>
                    <DashboardItem icon={RiAuctionFill} title="New Auction" route="/Dashboard/NewAuction" />
                    <DashboardItem icon={RiAuctionLine} title="My Auction" route="/Dashboard/MyAuction" />
                    {/* <DashboardItem icon={IoIosTv} title="Auction Panel" route="/Dashboard/AuctionalPanel" /> */}
                    <DashboardItem icon={CgProfile} title="My Profile" route="/Dashboard/Myprofile" />
                
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dash