import React from 'react'
import "./Navbar.css";
import { FaUserCircle } from "react-icons/fa"; // Import user icon


const Navbar = () => {
  return (
    <div className='navbar'>
        <h2>Morawakkorale Tea CooP</h2>

        <div className="profile">
        <FaUserCircle size={40} color="gray" />
        
        </div>
        
    </div>
  )
}

export default Navbar