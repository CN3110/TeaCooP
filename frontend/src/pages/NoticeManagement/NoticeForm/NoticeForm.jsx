import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './NoticeForm.css';
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

  const recipientOptions = [
    { value: 'employee', label: 'Employees' },
    { value: 'driver', label: 'Drivers' },
    { value: 'broker', label: 'Brokers' },
    { value: 'supplier', label: 'Suppliers' },
  ];

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title || '',
        content: notice.content || '',
        recipients: Array.isArray(notice.recipients)
          ? notice.recipients
          : notice.recipients?.split(',') || [],
        priority: notice.priority || 'medium',
        expiryDate: notice.expiry_date
          ? new Date(notice.expiry_date).toISOString().split('T')[0]
          : '',
      });
    }
  }, [notice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecipientChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      recipients: checked
        ? [...prev.recipients, value]
        : prev.recipients.filter(r => r !== value),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.content.trim()) newErrors.content = 'Content is required';
    if (formData.recipients.length === 0)
      newErrors.recipients = 'Select at least one recipient group';
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

      const payload = {
        title: formData.title,
        content: formData.content,
        recipients: formData.recipients,
        priority: formData.priority,
        expiry_date: formData.expiryDate || null,
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

          {/* Title */}
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

          {/* Recipients */}
          <div className="form-group">
            <label>Recipients</label>
            <div className="recipients-container">
              {recipientOptions.map(option => (
                <div key={option.value} className="recipient-checkbox">
                  <input
                    type="checkbox"
                    id={`recipient-${option.value}`}
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

          {/* Priority */}
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

          {/* Expiry Date */}
          <div className="form-group">
            <label htmlFor="expiryDate">Expiration Date</label>
            <input
              id="expiryDate"
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Content */}
          <div className="form-group">
            <label htmlFor="content">Notice Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              placeholder="Type your notice here..."
            />
            {errors.content && <p className="error-message">{errors.content}</p>}
          </div>

          {/* Buttons */}
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
