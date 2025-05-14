const TeaPacket = require("../models/teaPacket");

exports.addTeaPacket = async (req, res) => {
  const { productionDate, sourceMadeTeaWeight, packetWeight, numberOfPackets, createdBy } = req.body;

  if (!productionDate || !sourceMadeTeaWeight || !packetWeight || !numberOfPackets || !createdBy) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const availableData = await TeaPacket.getAvailableMadeTea();

    if (sourceMadeTeaWeight > availableData.availableForPackets) {
      return res.status(400).json({
        error: `Not enough made tea available. Only ${availableData.availableForPackets} kg remaining for packets this month.`
      });
    }

    const result = await TeaPacket.addTeaPacket(
      productionDate,
      sourceMadeTeaWeight,
      packetWeight,
      numberOfPackets,
      createdBy
    );

    res.status(201).json({
      message: "Tea packet record added successfully",
      packetId: result.insertId,
      availableMadeTea: availableData.availableForPackets - sourceMadeTeaWeight
    });
  } catch (error) {
    console.error("Error adding tea packet:", error);
    res.status(500).json({ error: "Failed to add tea packet record" });
  }
};

exports.getAllTeaPackets = async (req, res) => {
  try {
    const packets = await TeaPacket.getAllTeaPackets();
    res.json({ data: packets, total: packets.length });
  } catch (err) {
    console.error("Error fetching tea packets:", err);
    res.status(500).json({ error: 'Failed to fetch tea packets' });
  }
};



exports.getAvailableMadeTea = async (req, res) => {
  try {
    const data = await TeaPacket.getAvailableMadeTea();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching available made tea:", error);
    res.status(500).json({ error: "Failed to fetch available made tea data" });
  }
};


exports.deleteTeaPacket = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await TeaPacket.deleteTeaPacket(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tea packet not found" });
    }

    res.status(200).json({ message: "Tea packet deleted successfully" });
  } catch (error) {
    console.error("Error deleting tea packet:", error);
    res.status(500).json({ error: "Failed to delete tea packet" });
  }
};
