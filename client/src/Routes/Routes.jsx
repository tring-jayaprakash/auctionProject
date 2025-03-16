import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from '../Pages/LandingPage/LandingPage'
import Register from '../Pages/Register/Register'
import Login from '../Pages/Login/Login'
import ProtectedRoutes from '../ProductedRoute/ProtectedRoutes'
import { DashBoard } from '../Pages/DashBoard/DashBoard'
import Dash from '../Pages/Dash/Dash'
import NewAuction from '../Pages/NewAuction/NewAuction'
import MyAuction from '../Pages/MyAuction/MyAuction'
import AuctionalPanel from '../Pages/AuctionalPanel/AuctionalPanel'
import MyProfile from '../Pages/MyProfile/MyProfile'
import Team from '../Pages/Team/Team'
import Player from '../Pages/Player/Player'
import AuctionResult from '../Pages/AuctionResult/AuctionResult'
import TeamResult from '../Pages/TeamResult/TeamResult'
import PlayerResult from '../Pages/PlayerResult/PlayerResult'

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/Register' element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path='/Reault' element={<AuctionResult />} />
            <Route path='/Reault/TeamResult' element={<TeamResult />} />
            <Route path='/Reault/PlayerResult' element={<PlayerResult/>} />


            <Route element={<ProtectedRoutes />}>
                <Route path='/Dashboard' element={<DashBoard />}>
                    <Route path='' element={<Dash />} />
                    <Route path='NewAuction' element={<NewAuction />} />
                    <Route path='MyAuction' element={<MyAuction />} />
                    <Route path='AuctionalPanel' element={<AuctionalPanel />} />
                    <Route path='MyProfile' element={<MyProfile />} />
                    <Route path='MyAuction/Team' element={<Team />} />
                    <Route path='MyAuction/Player' element={<Player />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default Router