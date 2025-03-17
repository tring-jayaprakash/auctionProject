import { useState } from 'react'
import './App.css'
import "react-toastify/dist/ReactToastify.css";
import { CombinedComponents } from './components/CombinedComponents/CombinedComponents';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>App</h1>
    </>
  )
}

export default App
