import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewTeaTypesHome.css';

const ViewTeaTypesHome = () => {
  const [teaTypes, setTeaTypes] = useState([]);
  const navigate = useNavigate();

  // Fetch tea types from the backend
  useEffect(() => {
    const fetchTeaTypes = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/teaTypes');
        if (response.ok) {
          const data = await response.json();
          setTeaTypes(data);
        } else {
          console.error('Failed to fetch tea types:', response);
          alert('Failed to fetch tea types. Please try again.');
        }
      } catch (error) {
        console.error('Failed to fetch tea types:', error);
        alert('An error occurred while fetching tea types.');
      }
    };

    fetchTeaTypes();
  }, []);

  return (
    <div className='tea-varieties-container'>
      <h1>Our Tea Varieties</h1> 
      <button onClick={() => navigate('/aboutus')}>Back </button>
      <div className='tea-type-cards'>
        {teaTypes.map((teaType) => (
          <div key={teaType.teaTypeName} className='tea-type-card'>
            <h3>{teaType.teaTypeName}</h3>
            <p>{teaType.teaTypeDescription}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default ViewTeaTypesHome;