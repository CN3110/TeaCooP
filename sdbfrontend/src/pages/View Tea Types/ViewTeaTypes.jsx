import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewTeaTypes.css';

const ViewTeaTypes = () => {
  const [teaTypes, setTeaTypes] = useState([]);
  const [selectedTea, setSelectedTea] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Fetch tea types from the backend
  useEffect(() => {
    const fetchTeaTypes = async () => {
      setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeaTypes();
  }, []);

  const handleTeaSelect = (tea) => {
    setSelectedTea(selectedTea === tea ? null : tea);
  };

  const filteredTeaTypes = teaTypes.filter(tea => 
    tea.teaTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tea.teaTypeDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='tea-varieties-container'>
      <div className="tea-header">
        <h1>Discover Our Tea Varieties</h1>
        <button className="back-button" onClick={() => navigate('/')}>
          <span className="button-icon">←</span> Back Home
        </button>
      </div>
      
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for tea varieties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>
      
      {isLoading ? (
        <div className="tea-loading">
          <div className="tea-loader"></div>
          <p>Brewing your tea selection...</p>
        </div>
      ) : filteredTeaTypes.length === 0 ? (
        <div className="no-results">
          <p>No tea varieties found matching "{searchTerm}"</p>
          <button onClick={() => setSearchTerm('')}>Clear search</button>
        </div>
      ) : (
        <div className='tea-type-cards'>
          {filteredTeaTypes.map((teaType) => (
            <div 
              key={teaType.teaTypeName} 
              className={`tea-type-card ${selectedTea === teaType ? 'expanded' : ''}`}
              onClick={() => handleTeaSelect(teaType)}
            >
              <div className="tea-card-header">
                <h3>{teaType.teaTypeName}</h3>
                <span className="expand-icon">{selectedTea === teaType ? '−' : '+'}</span>
              </div>
              
              <div className="tea-card-content">
                <p>{teaType.teaTypeDescription}</p>
                
                {selectedTea === teaType && (
                  <div className="tea-details">
                    <div className="tea-attributes">
                      <div className="attribute">
                        <span>Caffeine</span>
                        <div className="attribute-bar">
                          <div 
                            className="attribute-fill" 
                            style={{ width: `${teaType.caffeine || Math.random() * 70 + 30}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="attribute">
                        <span>Flavor</span>
                        <div className="attribute-bar">
                          <div 
                            className="attribute-fill" 
                            style={{ width: `${teaType.flavor || Math.random() * 70 + 30}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="attribute">
                        <span>Aroma</span>
                        <div className="attribute-bar">
                          <div 
                            className="attribute-fill" 
                            style={{ width: `${teaType.aroma || Math.random() * 70 + 30}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <button className="learn-more-btn">Learn More</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="tea-facts">
        <div className="tea-fact">
          <h4>Did you know?</h4>
          <p>All true teas come from the same plant, Camellia sinensis. The differences come from processing methods.</p>
        </div>
      </div>
    </div>
  );
};

export default ViewTeaTypes;