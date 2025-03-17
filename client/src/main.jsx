import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CombinedComponents } from './components/CombinedComponents/CombinedComponents.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CombinedComponents/>
    {/* <App/> */}
  </StrictMode>
)
