const Notice = require('../models/notice');

// Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const { title, content, recipients, priority, expiry_date } = req.body;
    
    // Call model method to create a notice
    const notice = await Notice.createNotice(title, content, recipients, priority, expiry_date);
    
    res.status(201).json({ message: 'Notice created successfully', noticeId: notice.noticeId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notice', error: error.message });
  }
};

// Get all notices with filtering options
exports.getNotices = async (req, res) => {
  try {
    const { recipientType, status, sortBy = 'created_at DESC' } = req.query;
    
    // Get notices filtered by recipient type and/or status
    const notices = await Notice.getNotices(recipientType, status, sortBy);
    
    // Format the response data
    const formattedNotices = notices.map(notice => {
      // If recipients is a comma-separated string, convert to array
      if (notice.recipients && typeof notice.recipients === 'string') {
        notice.recipients = notice.recipients.split(',');
      }
      
      return notice;
    });
    
    res.json(formattedNotices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices', error: error.message });
  }
};

exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.getNoticeById(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    // Format recipients as array
    if (notice.recipients && typeof notice.recipients === 'string') {
      notice.recipients = notice.recipients.split(',');
    }
    
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notice', error: error.message });
  }
};

// Update a notice
exports.updateNotice = async (req, res) => {
  try {
    const { title, content, recipients, priority, expiry_date } = req.body;
    const noticeId = req.params.id;
    
    await Notice.updateNotice(noticeId, title, content, recipients, priority, expiry_date);
    
    res.json({ message: 'Notice updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notice', error: error.message });
  }
};

// Delete a notice
exports.deleteNotice = async (req, res) => {
  try {
    await Notice.deleteNotice(req.params.id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notice', error: error.message });
  }
};