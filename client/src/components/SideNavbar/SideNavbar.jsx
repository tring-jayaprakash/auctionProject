import React, { use } from 'react'
import './SideNavbar.css'
import { useNavigate } from 'react-router-dom'
const SideNavbar = () => {
  const navigater = useNavigate()


  return (
    <>
      <div id='SideNavbar'>
        <div onClick={() => navigater('/Dashboard')}> <b>Dashboard</b></div>
        <div onClick={() => navigater('/Dashboard/NewAuction')}><b>New Auction </b></div>
        <div onClick={() => navigater('/Dashboard/MyAuction')}><b>My Auction </b></div>
        <div onClick={() => navigater('/Dashboard/AuctionalPanel')}><b>Auction Panel </b></div>
        <div onClick={() => navigater('/Dashboard/Myprofile')}><b>My profile </b></div>
      </div>
    </>
  )
}

export default SideNavbar