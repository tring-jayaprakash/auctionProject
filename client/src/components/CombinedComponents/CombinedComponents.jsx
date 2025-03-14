import React from 'react'
import { BrowserRouter } from 'react-router-dom';
import GlobalProvider from '../../context/GlobalContext';


export const CombinedComponents = () => {

    return (
        <>
            <BrowserRouter>
                <GlobalProvider/>
            </BrowserRouter>
        </>
    )
}
