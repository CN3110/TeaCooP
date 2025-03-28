import React from 'react'
import { MdDashboard, MdNotifications } from "react-icons/md"; 
import { FaUsers } from "react-icons/fa";
import { AiOutlineFileText } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import "./Sidebar.css";
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <div className="sidebar-option">
        <MdDashboard size={24} style={{ marginRight: 10 }} /> Dashboard
        </div>

        <NavLink to='/manage-employees' className="sidebar-option">
        <FaUsers size={24} style={{ marginRight: 10 }} /> Manage Employees
        </NavLink>

        <div className="sidebar-option">
        <MdNotifications size={24} style={{ marginRight: 10 }} /> Manage Notices
        </div>

        <div className="sidebar-option">
        <AiOutlineFileText size={24} style={{ marginRight: 10 }} /> Generate Reports
        </div>

        <div className="sidebar-option">
        <FiLogOut size={24} style={{ marginRight: 10 }} /> Logout
        </div>
      </div>
    </div>
  )
}

export default Sidebar