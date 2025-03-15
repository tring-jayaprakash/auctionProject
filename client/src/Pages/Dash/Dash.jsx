import React, { useContext } from 'react';
import { RiAuctionFill, RiAuctionLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from 'react-router-dom';
import '../Dash/Dash.css';
import DashboardItem from '../../components/DashboardItem';
import { GlobalContext } from '../../context/GlobalContext';

const Dash = () => {
    const navigate = useNavigate();
    const { theme } = useContext(GlobalContext);

    const dashboardItems = [
        { icon: RiAuctionFill, title: "New Auction", route: "/Dashboard/NewAuction" },
        { icon: RiAuctionLine, title: "My Auction", route: "/Dashboard/MyAuction" },
        { icon: CgProfile, title: "My Profile", route: "/Dashboard/Myprofile" }
    ];

    return (
        <>
            <div id='main-div'>
                <div id='inner-div'>
                    <div id='header-div' style={{ color: theme.text, borderBottom: `2px solid ${theme.primary}` }}>
                        <h1>DASHBOARD</h1>
                    </div>
                    <div id='body-div'>
                        {dashboardItems.map((item, index) => (
                            <DashboardItem key={index} icon={item.icon} title={item.title} route={item.route} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dash;
