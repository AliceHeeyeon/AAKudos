import React from 'react'
//icons
import { IoHomeOutline } from "react-icons/io5";
import { FaMedal } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa";
import { FaBirthdayCake } from "react-icons/fa";
import { SlSettings } from "react-icons/sl";
import { FaUser } from "react-icons/fa6";
import { useNavigate } from 'react-router';

const DesktopMenu = () => {
    const navigate = useNavigate()
  return (
      <div className='desktop-menu'>
        <div className='primary-menu'>
            <ul>
                <li onClick={() => navigate('/')}>
                    <IoHomeOutline />
                    <p>Home</p>
                </li>
                <li onClick={() => navigate('/kudosboard')}>
                    <FaMedal />
                    <p>Kudos Board</p>
                </li>
                <li onClick={() => navigate('/saleschart')}>
                    <FaChartLine />
                    <p>Sales Chart</p>
                </li>
                <li onClick={() => navigate('/anniversary')}>
                    <FaBirthdayCake />
                    <p>Anniversary</p>
                </li>
            </ul>
        </div>
        <div className='account-menu'>
            <ul>
                <li onClick={() => navigate('/admin')}>
                    <SlSettings />
                    <p>Admin</p>
                </li>
                <li onClick={() => navigate('/myaccount')}>
                    <FaUser />
                    <p>My Account</p>
                </li>
            </ul>
        </div>
      </div>
  )
}

export default DesktopMenu
