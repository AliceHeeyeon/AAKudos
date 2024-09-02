import {HashRouter, Routes, Route} from 'react-router-dom'
import './css/App.css'

//pages
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'

//components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import DesktopMenu from './components/DesktopMenu'

function App() {
  return (
    <div className='App'>
      <HashRouter>
        <Navbar />
        <div className='desktop-flexbox'>
          <DesktopMenu />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
          </Routes>
        </div>
      </HashRouter>
    </div>
  )
}

export default App
