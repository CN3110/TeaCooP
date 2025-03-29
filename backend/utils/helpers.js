// Generate random password/passcode
const generateRandomPassword = (length = 8) => {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // Validate employee data
  const validateEmployeeData = (data) => {
    const errors = [];
    
    if (!data.employeeId) errors.push('Employee ID is required');
    if (!data.employeeName) errors.push('Employee name is required');
    if (!data.employeeContact_no) errors.push('Contact number is required');
    if (!data.employeeEmail) errors.push('Email is required');
    
    if (data.employeeEmail && !/^\S+@\S+\.\S+$/.test(data.employeeEmail)) {
      errors.push('Invalid email format');
    }
    
    return errors;
  };
  
  module.exports = {
    generateRandomPassword,
    validateEmployeeData
  };