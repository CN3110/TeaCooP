const Employee = require("../models/employee");
const nodemailer = require("nodemailer");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mkteacoop@gmail.com",
    pass: "sinr fmza uvxa soww",
  },
});

// Generate a random 6-digit passcode
const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const employeeController = {
  // Get all employees
  getAllEmployees: async (req, res) => {
    try {
      const employees = await Employee.getAll();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Get single employee
  getEmployeeById: async (req, res) => {
    try {
      const employee = await Employee.getById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Create new employee with email notification
  createEmployee: async (req, res) => {
    try {
      // Validate required fields
      if (
        !req.body.employeeId ||
        !req.body.employeeName ||
        !req.body.employeeContact_no ||
        !req.body.employeeEmail
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Generate passcode
      const passcode = generatePasscode();

      // Create employee with passcode
      const employeeData = {
        ...req.body,
        passcode: passcode,
      };

      const newEmployee = await Employee.create(employeeData);

      // Prepare email
      const mailOptions = {
        from: "mkteacoop@gmail.com",
        to: newEmployee.employeeEmail,
        subject: "Morawakkorale Tea CooP - Your Login Credentials",
        text: `Dear ${newEmployee.employeeName}, 

Your login credentials for the system are as follows:

Employee ID: ${newEmployee.employeeId}
Passcode: ${passcode}

Please use the above passcode during your first login. After logging in, you will be able to create your own password.

If you have any questions, please contact us.

Best regards,
Morawakkorale Tea Co-op
041-2271400`,
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          // Even if email fails, we still created the employee
          return res.status(201).json({
            message: "Employee created but email failed to send",
            employee: newEmployee,
          });
        }
        console.log("Email sent:", info.response);
        res.status(201).json({
          message: "Employee created successfully and email sent",
          employee: newEmployee,
        });
      });
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(400).json({
        message: error.message || "Failed to create employee",
      });
    }
  },

  // Update employee
  updateEmployee: async (req, res) => {
    try {
      if (
        !req.body.employeeName ||
        !req.body.employeeContact_no ||
        !req.body.employeeEmail
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const updatedEmployee = await Employee.update(req.params.id, req.body);
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(updatedEmployee);
    } catch (error) {
      res.status(400).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = employeeController;