const express = require("express");
const {
  addTeaPacket,
  getAllTeaPackets,
  getAvailableMadeTea,
  deleteTeaPacket,
} = require("../controllers/teaPacketController");

const router = express.Router();

router.get("/", getAllTeaPackets);
router.post("/", addTeaPacket);
router.get("/available", getAvailableMadeTea);
router.delete("/:id", deleteTeaPacket);

module.exports = router;