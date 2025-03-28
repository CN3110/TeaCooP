const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.post("/set-password", authController.setPassword);
router.get("/dashboard", authController.getDashboard);

module.exports = router;
