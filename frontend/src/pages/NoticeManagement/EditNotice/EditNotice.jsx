import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NoticeForm from '../NoticeForm/NoticeForm';
import './EditNotice.css'; // Optional

const EditNotice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('Editing notice ID:', id);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/notices/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notice details');
        }
        
        const data = await response.json();

        // Map backend response to frontend form fields
        const mappedNotice = {
          title: data.title || '',
          content: data.content || '',
          recipients: Array.isArray(data.recipient) 
            ? data.recipient 
            : data.recipient ? [data.recipient] : [], // Handle string to array
          priority: data.priority || 'medium',
          expiryDate: data.expiry_date ? new Date(data.expiry_date).toISOString().split('T')[0] : ''
        };

        setNotice(mappedNotice);
        setError(null);
      } catch (err) {
        console.error('Error fetching notice:', err);
        setError('Failed to load notice details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  if (loading) {
    return (
      <div className="edit-notice-container">
        <div className="loading-spinner">Loading notice details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-notice-container">
        <div className="error-message">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={() => navigate('/notice-list')} className="btn back-btn">
            Back to Notices
          </button>
        </div>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className="edit-notice-container">
        <div className="not-found-message">
          <h3>Notice Not Found</h3>
          <p>The notice you're trying to edit doesn't exist or has been deleted.</p>
          <button onClick={() => navigate('/notice-list')} className="btn back-btn">
            Back to Notices
          </button>
        </div>
      </div>
    );
  }

  return <NoticeForm editMode={true} notice={notice} />;
};

export default EditNotice;
