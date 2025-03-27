import React from 'react'
import { BrowserRouter, Router } from 'react-router-dom';
import GlobalProvider from '../../context/GlobalContext';
import { NavBar } from '../../Pages/NavBar/NavBar';


export const CombinedComponents = () => {

    return (
        <>
            <BrowserRouter>
                <GlobalProvider/>
            </BrowserRouter>
        </>
    )
}
