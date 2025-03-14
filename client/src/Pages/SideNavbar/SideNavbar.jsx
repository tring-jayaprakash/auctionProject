import React, {useContext} from 'react'
import './SideNavbar.css'
import { useNavigate } from 'react-router-dom'
import { GlobalContext } from '../../context/GlobalContext';




const SideNavbar = () => {
    const { user, setUser } = useContext(GlobalContext);
    
    const navigater = useNavigate()
    
    const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigater("/home");
};

  return (
    <>
      <div id='SideNavbar'>
        <div id='sideNavbar' onClick={() => navigater('/Dashboard')}> <b>Dashboard</b></div>
        <div id='sideNavbar' onClick={() => navigater('/Dashboard/NewAuction')}><b>New Auction </b></div>
        <div id='sideNavbar' onClick={() => navigater('/Dashboard/MyAuction')}><b>My Auction </b></div>
        {/* <div id='sideNavbar' onClick={() => navigater('/Dashboard/AuctionalPanel')}><b>Auction Panel </b></div> */}
        <div id='sideNavbar' onClick={() => navigater('/Dashboard/Myprofile')}><b>My profile </b></div>
        <div id='logoutNavBar' onClick={handleLogout}><b>Logout </b></div>
      </div>
    </>
  )
}

export default SideNavbar