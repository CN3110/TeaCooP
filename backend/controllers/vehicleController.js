const db = require("../config/database");

//add vehicle details for a driver
exports.addVehicleDetails = async (req, res) => {
  const { driverId, vehicleDetails } = req.body;

  if (!driverId || !Array.isArray(vehicleDetails) || vehicleDetails.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    //insert vehicle details into the vehicle table
    for (const vehicle of vehicleDetails) {
      await db.query(
        "INSERT INTO vehicle (driverId, vehicleNumber, vehicleType) VALUES (?, ?, ?)",
        [driverId, vehicle.vehicleNumber, vehicle.vehicleType]
      );
    }

    res.status(201).json({ message: "Vehicle details added successfully" });
  } catch (error) {
    console.error("Error adding vehicle details:", error);
    res.status(500).json({ error: "Failed to add vehicle details" });
  }
};

//fetch vehicle details for a driver
exports.getVehicleDetailsByDriverId = async (req, res) => {
  const { driverId } = req.params;

  if (!driverId) {
    return res.status(400).json({ error: "Driver ID is required" });
  }

  try {
    const [vehicleDetails] = await db.query(
      "SELECT * FROM vehicle WHERE driverId = ?",
      [driverId]
    );

    res.status(200).json(vehicleDetails);
  } catch (error) {
    console.error("Error fetching vehicle details:", error);
    res.status(500).json({ error: "Failed to fetch vehicle details" });
  }
};

//update vehicle details
exports.updateVehicleDetails = async (req, res) => {
  const { vehicleId } = req.params;
  const { vehicleNumber, vehicleType } = req.body;

  if (!vehicleId || !vehicleNumber || !vehicleType) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  try {
    await db.query(
      "UPDATE vehicle SET vehicleNumber = ?, vehicleType = ? WHERE vehicleId = ?",
      [vehicleNumber, vehicleType, vehicleId]
    );

    res.status(200).json({ message: "Vehicle details updated successfully" });
  } catch (error) {
    console.error("Error updating vehicle details:", error);
    res.status(500).json({ error: "Failed to update vehicle details" });
  }
};

//delete vehicle details
exports.deleteVehicleDetails = async (req, res) => {
  const { vehicleId } = req.params;

  if (!vehicleId) {
    return res.status(400).json({ error: "Vehicle ID is required" });
  }

  try {
    await db.query("DELETE FROM vehicle WHERE vehicleId = ?", [vehicleId]);

    res.status(200).json({ message: "Vehicle details deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle details:", error);
    res.status(500).json({ error: "Failed to delete vehicle details" });
  }
};