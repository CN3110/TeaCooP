// models/noticeModel.js
const db = require('../config/database');



// Create a new notice
const createNotice = async (title, content, recipients, priority, expiryDate) => {
  try {
    // Insert into notice table
    const [result] = await db.query(
      'INSERT INTO notice (title, content, priority, expiry_date) VALUES (?, ?, ?, ?)',
      [title, content, priority, expiryDate]
    );
    
    const noticeId = result.insertId;
    
    // Insert recipients
    const recipientValues = recipients.map(type => [noticeId, type]);
    await db.query(
      'INSERT INTO notice_recipient (notice_id, recipient_type) VALUES ?',
      [recipientValues]
    );
    
    return { noticeId };
  } catch (error) {
    throw new Error('Error creating notice: ' + error.message);
  }
};

// Get all notice with filtering options
const getNotices = async (recipientType, status, sortBy) => {
  try {
    let query = `
      SELECT n.*, GROUP_CONCAT(nr.recipient_type) as recipient
      FROM notice n
      LEFT JOIN notice_recipient nr ON n.id = nr.notice_id
    `;
    
    const whereConditions = [];
    const params = [];
    
    if (recipientType) {
      whereConditions.push('nr.recipient_type = ?');
      params.push(recipientType);
    }
    
    if (status) {
      whereConditions.push('n.status = ?');
      params.push(status);
    }
    
    if (whereConditions.length) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }
    
    query += ' GROUP BY n.id ORDER BY ' + sortBy;
    
    const [notice] = await db.query(query, params);
    return notice;
  } catch (error) {
    throw new Error('Error fetching notice: ' + error.message);
  }
};

// Get a single notice
const getNoticeById = async (id) => {
  try {
    const [notice] = await db.query(
      `SELECT n.*, GROUP_CONCAT(nr.recipient_type) as recipients
       FROM notice n
       LEFT JOIN notice_recipient nr ON n.id = nr.notice_id
       WHERE n.id = ?
       GROUP BY n.id`,
      [id]
    );
    
    return notice.length ? notice[0] : null;
  } catch (error) {
    throw new Error('Error fetching notice: ' + error.message);
  }
};

// Update a notice
const updateNotice = async (noticeId, title, content, recipients, priority, expiryDate) => {
  try {
    // Update notice
    await db.query(
      'UPDATE notice SET title = ?, content = ?, priority = ?, expiry_date = ? WHERE id = ?',
      [title, content, priority, expiryDate, noticeId]
    );
    
    // Delete existing recipients
    await db.query('DELETE FROM notice_recipient WHERE notice_id = ?', [noticeId]);
    
    // Insert new recipients
    const recipientValues = recipients.map(type => [noticeId, type]);
    await db.query(
      'INSERT INTO notice_recipient (notice_id, recipient_type) VALUES ?',
      [recipientValues]
    );
  } catch (error) {
    throw new Error('Error updating notice: ' + error.message);
  }
};

// Delete a notice
const deleteNotice = async (id) => {
  try {
    await db.query('DELETE FROM notice WHERE id = ?', [id]);
  } catch (error) {
    throw new Error('Error deleting notice: ' + error.message);
  }
};

module.exports = {
  createNotice,
  getNoticeById,
  updateNotice,
  deleteNotice,
  getNotices,
};
