import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from 'react-router-dom';
import GlobalProvider from './context/GlobalContext';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <GlobalProvider />
    </BrowserRouter>
  )
}

export default App
