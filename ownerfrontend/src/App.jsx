import React from 'react'
import {Routes, Route} from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import ManageEmployees from './pages/ManageEmployees/ManageEmployees'
import ManageNotices from './pages/ManageNotices/ManageNotices'

const App = () => {
  return (
    <div>
      <Navbar/>
      <hr/>
      <div className="app-content">
        <Sidebar/>
        <Routes>
         <Route path="/manage-employees" element={<ManageEmployees/>}/>
         <Route path="/manage-notices" element={<ManageNotices/>}/> 
         <Route path="/manage-employees" element={<ManageEmployees/>}/>  
        </Routes>
      </div>
    </div>
  )
}

export default App