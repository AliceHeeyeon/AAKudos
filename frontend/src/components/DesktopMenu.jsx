import React from 'react'
//icons
import { IoHomeOutline } from "react-icons/io5";
import { FaMedal } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FaBirthdayCake } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { FaUser } from "react-icons/fa6";

const DesktopMenu = () => {
  return (
    <div>
      <div className='desktop-menu'>
        <div className='primary-menu'>
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
            </ul>
        </div>
        <div className='account-menu'>
            <ul>
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
      </div>
    </div>
  )
}

export default DesktopMenu
