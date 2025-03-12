import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from '../components/LandingPage/LandingPage'
import Register from '../components/Register/Register'
import Login from '../components/Login/Login'
import ProtectedRoutes from '../ProductedRoute/ProtectedRoutes'
import { DashBoard } from '../components/DashBoard/DashBoard'
import Dash from '../components/Dash/Dash'
import NewAuction from '../components/NewAuction/NewAuction'
import MyAuction from '../components/MyAuction/MyAuction'
import AuctionalPanel from '../components/AuctionalPanel/AuctionalPanel'
import MyProfile from '../components/MyProfile/MyProfile'
import Team from '../components/Team/Team'
import Player from '../components/Player/Player'

const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/Register' element={<Register />} />
            <Route path="/Login" element={<Login />} />


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