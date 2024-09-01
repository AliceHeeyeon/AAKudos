import { useState } from "react";
import Hamburger from 'hamburger-react';
//components
import MobileMenu from "./MobileMenu";
//icons
import { RiLogoutCircleRLine } from "react-icons/ri";

const Navbar = () => {
    const [isOpen, setOpen] = useState(false);
  return (
    <nav>
        {/* Desktop */}
      <div className='nav-desktop'>
        <div className='logo-box-desktop'>
            <img src='./src/images/AA-logo.svg' alt='aa-logo' />
            <p className='logo-text-desktop'>Staff Recognition</p>
        </div>
        <div className='login-info'>
            <div className='user-info'>
                <h4>Alice Kim</h4>
                <p>IT Intern</p>
            </div>
            <div className='logout-btn'>
                <RiLogoutCircleRLine />
            </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="nav-mobile">
        <div className="hamburger-menu-mobile">
            <Hamburger toggled={isOpen} toggle={setOpen} />
        </div>
        <div className="logo-box-mobile">
            <img src='./src/images/logo.svg' alt='logo-mobile' />
        </div>
        <div className='login-info'>
            <div className='user-info'>
                <h4>Alice Kim</h4>
                <p>IT Intern</p>
            </div>
            <div className='logout-btn'>
                <RiLogoutCircleRLine />
            </div>
        </div>
      </div>

      {isOpen && <MobileMenu />}

    </nav>
  )
}

export default Navbar
