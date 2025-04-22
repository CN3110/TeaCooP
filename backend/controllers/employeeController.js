const db = require("../config/database");
const employee = require("../models/employee");
const nodemailer = require("nodemailer");

// Generate random passcode
const generatePasscode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.addEmployee = async (req, res) => {
  const {
    employeeName,
    employeeContact_no,
    employeeEmail,
    status = "pending",
    notes = null,
  } = req.body;

  if (!employeeName || !employeeContact_no || !employeeEmail) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const employeeId = await employee.generateEmployeeId();
    const passcode = generatePasscode();

    await employee.createEmployee({
      employeeId,
      employeeName,
      employeeContact_no,
      employeeEmail,
      status,
      notes,
    });

    if (status === "active") {
      // Send email with credentials
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: employeeEmail,
        subject: "Morawakkorale Tea CooP - Your Login Credentials",
        text: `Dear ${employeeName},

Your login credentials for the system are as follows:
User ID: ${employeeId}
Passcode: ${passcode}

Please use the above passcode as your password during your login. It does not expire. After logging in, you will be able to create your own password through the "Forgot Password" option.

If you have any questions, please contact us.

Best regards,
Morawakkorale Tea Co-op
041-2271400`,
      };

      await transporter.sendMail(mailOptions);
    } 
    res.status(201).json({ message: "Employee added successfully!" });
  } catch (error) {
    console.error("Error adding Employee:", error);
    res.status(500).json({ error: "Failed to add Employee" });
  }
};

//get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await employee.getAllEmployees();
    res.status(200).json(employees)
    } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
};


//get employee by id
exports.getEmployeeById = async (req, res) => {
  const{employeeId} = req.params;
  try {
    const employeeData = await employee.getEmployeeById(employeeId);
    if (!employeeData) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ error: "Failed to fetch employee" });
  }
};
   

//update employee by id
exports.updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const { employeeName, employeeContact_no, employeeEmail, status, notes } = req.body;

  if (!employeeName || !employeeContact_no || !employeeEmail) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const validStatuses = ["active", "inactive", "pending"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const existing = await employee.getEmployeeById(employeeId);
    if (!existing) {
      return res.status(404).json({ error: "Employee not found" });
    } 
    await employee.updateEmployee( {
      employeeId,
      employeeName,
      employeeContact_no,
      employeeEmail,
      status,
      notes,
    });
    res.status(200).json({
      message: `Employee ${
        status === "disabled" ? "disabled" : "updated"
      } successfully`,
      status,
    });
  } catch (error) {
    console.error("Error updating Employee:", error);
    res.status(500).json({ error: error.message || "Failed to update Employee" });
  }
};
    
exports.disableEmployee = async (req, res) => {
  const { employeeId } = req.params;

  try {
    // Check if employee exists
    const [employee] = await db.query("SELECT * FROM employee WHERE employeeId = ?", [employeeId]);
    if (!employee.length) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // Update status to disabled
    await db.query(
      "UPDATE employee SET status = 'disabled' WHERE employeeId = ?",
      [employeeId]
    );

    res.status(200).json({ message: "Employee disabled successfully" });
  } catch (error) {
    console.error("Error disabling employee", error);
    res.status(500).json({ error: "Failed to disable employee" });
  }
};
