//icons
import { IoHomeOutline } from "react-icons/io5";
import { FaMedal } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FaBirthdayCake } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router";

const MobileMenu = ({toggle}) => {
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path)
    toggle(false)
  }
  return (
    <div className='mobile-menu'>
      <ul>
        <li className='cursor-pointer' onClick={() => handleMenuClick('/')}>
            <IoHomeOutline />
            <p>Home</p>
        </li>
        <li className='cursor-pointer' onClick={() => handleMenuClick('/kudosboard')}>
            <FaMedal />
            <p>Kudos Board</p>
        </li>
        <li className='cursor-pointer' onClick={() => handleMenuClick('/saleschart')}>
            <FaChartLine />
            <p>Sales Chart</p>
        </li>
        <li className='cursor-pointer' onClick={() => handleMenuClick('/anniversary')}>
            <FaBirthdayCake />
            <p>Anniversary</p>
        </li>
        <li className='cursor-pointer' onClick={() => handleMenuClick('/admin')}>
            <SlSettings />
            <p>Admin</p>
        </li>
        <li className='cursor-pointer' onClick={() => handleMenuClick('/myaccount')}>
            <FaUser />
            <p>My Account</p>
        </li>
      </ul>
    </div>
  )
}

export default MobileMenu
