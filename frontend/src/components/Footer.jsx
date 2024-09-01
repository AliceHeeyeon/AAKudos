import React from 'react'

const Footer = () => {
  return (
    <footer>
      <div className='footer-logo-box'>
        <img src='./src/images/logo.svg' alt='logo-mobile' />
        <p>Staff Recognition</p>
      </div>

      <div className='footer-menu'>
        <ul>
          <li>Home</li>
          <li>Kudos board</li>
          <li>Sales chart</li>
          <li>Anniversary</li>
        </ul>
      </div>

      <div className='copyright'>
        <p>&copy; Copyright Automation Associates</p>
      </div>
    </footer>
  )
}

export default Footer
