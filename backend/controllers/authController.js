const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/user");

dotenv.config();

exports.login = async (req, res) => {
    try {
        const { userId, passcode } = req.body;
        
        // Input validation
        if (!userId || !passcode) {
            console.log(`Login attempt with missing fields - userId: ${userId}`);
            return res.status(400).json({ message: "User ID and passcode are required" });
        }

        User.getUserById(userId, async (err, results) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Internal server error" });
            }

            if (results.length === 0) {
                console.log(`Login attempt for non-existent user: ${userId}`);
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const user = results[0];
            console.log(`Login attempt for ${userId}`, { 
                hasPasscode: !!user.passcode,
                hasPassword: !!user.password 
            });

            // Temporary passcode flow
            if (user.passcode && user.passcode === passcode) {
                console.log(`Temporary passcode login successful for ${userId}`);
                const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
                return res.json({ 
                    message: "Login successful", 
                    token, 
                    firstLogin: true 
                });
            }
            
            // Hashed password flow
            if (user.password) {
                const isMatch = await bcrypt.compare(passcode, user.password);
                console.log(`Password comparison result for ${userId}: ${isMatch}`);
                
                if (isMatch) {
                    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
                    return res.json({ 
                        message: "Login successful", 
                        token, 
                        firstLogin: false 
                    });
                }
            }

            console.log(`Failed login attempt for ${userId}`);
            return res.status(401).json({ message: "Invalid credentials" });
        });
    } catch (error) {
        console.error("Unexpected error in login:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.setPassword = async (req, res) => {
    try {
        const { userId, newPassword, confirmPassword } = req.body;
        
        // Validation
        if (!userId || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }
        
        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12); // Increased salt rounds
        
        User.updateUserPassword(userId, hashedPassword, (err) => {
            if (err) {
                console.error("Password update error:", err);
                return res.status(500).json({ message: "Failed to update password" });
            }
            
            console.log(`Password updated successfully for ${userId}`);
            res.json({ message: "Password set successfully" });
        });
    } catch (error) {
        console.error("Error in setPassword:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getDashboard = (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token required" });
        }

        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.error("JWT verification error:", err);
                return res.status(403).json({ message: "Invalid or expired token" });
            }

            const { userId } = decoded;
            let dashboardURL;
            
            if (userId.startsWith("S")) dashboardURL = "/supplierdashboard";
            else if (userId.startsWith("D")) dashboardURL = "/driverdashboard";
            else if (userId.startsWith("B")) dashboardURL = "/brokerdashboard";
            else {
                console.error(`Invalid role prefix in userId: ${userId}`);
                return res.status(400).json({ message: "Invalid user role" });
            }

            res.json({ dashboardURL });
        });
    } catch (error) {
        console.error("Error in getDashboard:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};