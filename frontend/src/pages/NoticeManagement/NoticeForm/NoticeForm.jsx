import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NoticeForm.css'
import AdminLayout from '../../../components/AdminLayout/AdminLayout';

const NoticeForm = ({ editMode = false, notice = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    recipients: [],
    priority: 'medium',
    expiryDate: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This useEffect will update the form data whenever the notice prop changes
  useEffect(() => {
    if (notice) {
      console.log('Notice data received:', notice);
      setFormData({
        title: notice.title || '',
        content: notice.content || '',
        recipients: Array.isArray(notice.recipients) 
          ? notice.recipients 
          : (notice.recipients ? notice.recipients.split(',') : []),
        priority: notice.priority || 'medium',
        expiryDate: notice.expiry_date ? new Date(notice.expiry_date).toISOString().split('T')[0] : '',
      });
    }
  }, [notice]);

  const recipientOptions = [
    { value: 'employees', label: 'Employees' },
    { value: 'drivers', label: 'Drivers' },
    { value: 'brokers', label: 'Brokers' },
    { value: 'suppliers', label: 'Suppliers' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRecipientChange = (e) => {
    const { value, checked } = e.target;
    let updatedRecipients = [...formData.recipients];

    if (checked) {
      updatedRecipients.push(value);
    } else {
      updatedRecipients = updatedRecipients.filter(type => type !== value);
    }

    setFormData({ ...formData, recipients: updatedRecipients });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.recipients.length === 0) newErrors.recipients = 'Select at least one recipient group';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    try {
      const url = editMode && notice?.id 
        ? `http://localhost:3001/api/notices/${notice.id}`
        : 'http://localhost:3001/api/notices';
  
      const method = editMode && notice?.id ? 'PUT' : 'POST';
  
      // 👉 Fully fixed payload
      const payload = {
        title: formData.title,
        content: formData.content,
        recipients: formData.recipients,  // ✅ Send as array, not string
        priority: formData.priority,
        expiry_date: formData.expiryDate || null, // 🛡 if no expiry selected
      };
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) throw new Error('Failed to save notice');
      navigate('/notice-list');
    } catch (error) {
      console.error('Error saving notice:', error);
      setErrors({ form: 'Failed to save notice. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <AdminLayout>
    <div className="notice-form-container">
      <h2>{editMode ? 'Edit Notice' : 'Create New Notice'}</h2>
      {errors.form && <div className="form-error">{errors.form}</div>}

      <form onSubmit={handleSubmit} className="notice-form">
        
        <div className="form-group">
          <label htmlFor="title">Notice Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter notice title"
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label>Recipients</label>
          <div className="recipients-container">
            {recipientOptions.map(option => (
              <div key={option.value} className="recipient-checkbox">
                <input
                  type="checkbox"
                  id={`recipient-${option.value}`}
                  name="recipients"
                  value={option.value}
                  checked={formData.recipients.includes(option.value)}
                  onChange={handleRecipientChange}
                />
                <label htmlFor={`recipient-${option.value}`}>{option.label}</label>
              </div>
            ))}
          </div>
          {errors.recipients && <p className="error-message">{errors.recipients}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="expiryDate">Expiration Date</label>
          <input
            id="expiryDate"
            type="date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Notice Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="6"
            placeholder="Type your notice here..."
          ></textarea>
          {errors.content && <p className="error-message">{errors.content}</p>}
        </div>

        <div className="form-buttons">
          <button
            type="button"
            onClick={() => navigate('/notice-list')}
            className="btn cancel-btn"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn submit-btn"
          >
            {isSubmitting ? 'Saving...' : editMode ? 'Update Notice' : 'Create Notice'}
          </button>
        </div>

      </form>
    </div>
    </AdminLayout>  
  );
};

export default NoticeForm;