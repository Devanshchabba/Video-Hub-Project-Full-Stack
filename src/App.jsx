import './index.css'
import Home from './pages/home.jsx'
import { Outlet } from 'react-router-dom'
import {  NavBar } from './pages/index.jsx'
import Check from './components/Check.jsx'
function App() {

  return (
    <>
    
      {/* <Home /> */}
      {/* <Check/> */}
      <NavBar />
      <main>
        <Outlet />
      </main>

    </>
  )
}

export default App
