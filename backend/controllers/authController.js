const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Employee Signup
const signup = async (req, res) => {
    const { employeeId, employeeName, employeeContactNo, employeePassword } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(employeePassword, 10);

        // Insert employee into the database
        const [result] = await pool.execute(
            "INSERT INTO employee (employeeId, employeeName, employeeContact_no, employeePassword) VALUES (?, ?, ?, ?)",
            [employeeId, employeeName, employeeContactNo, hashedPassword]
        );

        res.status(201).json({ message: "Employee registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error registering employee" });
    }
};

// Employee Login
const login = async (req, res) => {
    const { employeeId, employeePassword } = req.body;

    try {
        // Fetch employee from the database
        const [rows] = await pool.execute(
            "SELECT * FROM employee WHERE employeeId = ?",
            [employeeId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const employee = rows[0];

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(employeePassword, employee.employeePassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { employeeId: employee.employeeId },
            "your_secret_key", // Replace with a strong secret key
            { expiresIn: "1h" }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
};

module.exports = { signup, login };