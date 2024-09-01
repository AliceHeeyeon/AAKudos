//icons
import { IoHomeOutline } from "react-icons/io5";
import { FaMedal } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FaBirthdayCake } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { FaUser } from "react-icons/fa6";

const MobileMenu = () => {
  return (
    <div className='mobile-menu'>
      <ul>
        <li>
            <IoHomeOutline />
            <p>Home</p>
        </li>
        <li>
            <FaMedal />
            <p>Kudos Board</p>
        </li>
        <li>
            <FaChartLine />
            <p>Sales Chart</p>
        </li>
        <li>
            <FaBirthdayCake />
            <p>Anniversary</p>
        </li>
        <li>
            <SlSettings />
            <p>Admin</p>
        </li>
        <li>
            <FaUser />
            <p>My Account</p>
        </li>
      </ul>
    </div>
  )
}

export default MobileMenu
