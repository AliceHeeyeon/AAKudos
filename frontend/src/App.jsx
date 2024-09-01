import {HashRouter, Routes, Route} from 'react-router-dom'
import './css/App.css'

//pages
import Home from './pages/Home'

//components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import DesktopMenu from './components/DesktopMenu'

function App() {
  return (
    <div className='App'>
      <HashRouter>
        <Navbar />
        <DesktopMenu />
          <Routes>
            <Route path='/' element={<Home />} />
          </Routes>
        <Footer />
      </HashRouter>
    </div>
  )
}

export default App
