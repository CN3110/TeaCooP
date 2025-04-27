const Notice = require('../models/notice');

// Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const { title, content, recipients, priority, expiryDate } = req.body;
    
    // Call model method to create a notice
    const notice = await Notice.createNotice(title, content, recipients, priority, expiryDate);
    
    res.status(201).json({ message: 'Notice created successfully', noticeId: notice.noticeId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating notice', error: error.message });
  }
};

// Get all notices with filtering options
exports.getNotices = async (req, res) => {
  try {
    const { recipientType, status, sortBy = 'created_at DESC' } = req.query;
    
    const notices = await Notice.getNotices(recipientType, status, sortBy);
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notices', error: error.message });
  }
};

// Get a single notice
exports.getNotice = async (req, res) => {
  try {
    const notice = await Notice.getNotice(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }
    
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notice', error: error.message });
  }
};

// Update a notice
exports.updateNotice = async (req, res) => {
  try {
    const { title, content, recipients, priority, expiryDate } = req.body;
    const noticeId = req.params.id;
    
    await Notice.updateNotice(noticeId, title, content, recipients, priority, expiryDate);
    
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
