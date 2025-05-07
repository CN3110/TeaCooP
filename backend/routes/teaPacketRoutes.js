const express = require("express");
const {
  addTeaPacket,
  getAllTeaPackets,
  getAvailableMadeTea
} = require("../controllers/teaPacketController");

const router = express.Router();

router.get("/", getAllTeaPackets);
router.post("/", addTeaPacket);
router.get("/available", getAvailableMadeTea);

module.exports = router;