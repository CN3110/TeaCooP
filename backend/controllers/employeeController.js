const Employee = require("../models/employee");
const nodemailer = require("nodemailer");
const { generateRandomPassword } = require('../utils/helpers');

// Configure Nodemailer (move to config file in production)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const employeeController = {
  // Get all employees (for admin view)
  getAllEmployees: async (req, res) => {
    try {
      const employees = await Employee.getAll();
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Server error while fetching employees" });
    }
  },

  // Get single employee (for profile view)
  getEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.getById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error(`Error fetching employee ${req.params.id}:`, error);
      res.status(500).json({ message: "Server error while fetching employee" });
    }
  },

  // Create new employee with email notification
  createEmployee: async (req, res) => {
    try {
      // Validate required fields
      const requiredFields = ['employeeId', 'employeeName', 'employeeContact_no', 'employeeEmail'];
      const missingFields = requiredFields.filter(field => !req.body[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({ 
          message: "Missing required fields",
          missingFields
        });
      }

      // Validate email format
      if (!/^\S+@\S+\.\S+$/.test(req.body.employeeEmail)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Generate initial passcode
      const passcode = generateRandomPassword(6);

      // Create employee
      const employeeData = {
        ...req.body,
        passcode
      };

      const newEmployee = await Employee.create(employeeData);

      // Send email with credentials
      try {
        await transporter.sendMail({
          from: `"Morawakkorale Tea Co-op" <${process.env.EMAIL_USER}>`,
          to: newEmployee.employeeEmail,
          subject: "Your Login Credentials",
          html: `
            <p>Dear ${newEmployee.employeeName},</p>
            <p>Your account has been created with the following credentials:</p>
            <ul>
              <li><strong>Employee ID:</strong> ${newEmployee.employeeId}</li>
              <li><strong>Temporary Passcode:</strong> ${passcode}</li>
            </ul>
            <p>Please use this passcode for your first login. After logging in, you will be able to create your own password.</p>
            <p>If you didn't request this, please contact the administrator immediately.</p>
            <p>Best regards,<br>Morawakkorale Tea Co-op</p>
          `
        });
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
        // Continue even if email fails
      }

      res.status(201).json({
        message: "Employee created successfully",
        employee: {
          employeeId: newEmployee.employeeId,
          employeeName: newEmployee.employeeName,
          employeeEmail: newEmployee.employeeEmail
        }
      });
    } catch (error) {
      console.error("Error creating employee:", error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: "Employee ID already exists" });
      }
      
      res.status(500).json({ 
        message: error.message || "Failed to create employee",
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  },

  // Update employee profile
  updateEmployee: async (req, res) => {
    try {
      const { employeeName, employeeContact_no, employeeEmail } = req.body;
      
      // Basic validation
      if (!employeeName || !employeeContact_no || !employeeEmail) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const updatedEmployee = await Employee.update(req.params.id, req.body);
      
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json({
        message: "Employee updated successfully",
        employee: updatedEmployee
      });
    } catch (error) {
      console.error(`Error updating employee ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update employee" });
    }
  },

  // Update employee password
  updateEmployeePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: "Both current and new passwords are required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
      }
      
      // Verify current password
      const isValid = await Employee.verifyPasscode(req.params.id, currentPassword);
      if (!isValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Update to new password
      const success = await Employee.updatePassword(req.params.id, newPassword);
      
      if (!success) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error(`Error updating password for employee ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to update password" });
    }
  },

  // Delete employee
  deleteEmployee: async (req, res) => {
    try {
      const success = await Employee.delete(req.params.id);
      
      if (!success) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      console.error(`Error deleting employee ${req.params.id}:`, error);
      res.status(500).json({ message: "Failed to delete employee" });
    }
  }
};

module.exports = employeeController;