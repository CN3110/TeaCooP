const express = require("express");
const { signup, login } = require("../controllers/authController");

const router = express.Router();

// Employee Signup
router.post("/signup", signup);

// Employee Login
router.post("/login", login);

module.exports = router;