import React from 'react'
import { RiAuctionFill, RiAuctionLine } from "react-icons/ri";
import { IoIosTv } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import './Dash.css'

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
                        <div onClick={() => navigater('/Dashboard/NewAuction')}>

                            <h1>
                                <RiAuctionFill />
                            </h1>
                            <h1>
                                New Auction
                            </h1>

                        </div>
                        <div onClick={() => navigater('/Dashboard/MyAuction')}>
                            <h1>
                                <RiAuctionLine />
                            </h1>
                            <h1>
                                My Auction
                            </h1>
                        </div>
                        <div onClick={() => navigater('/Dashboard/AuctionalPanel')}>
                            <h1>
                                <IoIosTv />
                            </h1>
                            <h1>
                                Auction Panel
                            </h1>
                        </div>
                        <div onClick={() => navigater('/Dashboard/Myprofile')}>
                            <h1>
                                <CgProfile />
                            </h1>
                            <h1>
                                My profile
                            </h1>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dash