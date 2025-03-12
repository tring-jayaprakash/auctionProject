import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import GlobalProvider from './context/GlobalContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CombinedComponents } from './components/CombinedComponents/CombinedComponents.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CombinedComponents/>
    {/* <App/> */}
  </StrictMode>
)
