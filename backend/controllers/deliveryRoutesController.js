const db = require("../config/database");

// Fetch all delivery routes
exports.getAllDeliveryRoutes = async (req, res) => {
  try {
    const [deliveryRoutes] = await db.query("SELECT * FROM delivery_route");
    res.status(200).json(deliveryRoutes);
  } catch (error) {
    console.error("Error fetching delivery routes:", error);
    res.status(500).json({ error: "Failed to fetch delivery routes" });
  }
};

// Add a new delivery route
exports.addDeliveryRoute = async (req, res) => {
  const { deliveryRouteName } = req.body;

  // Validate required fields
  if (!deliveryRouteName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Insert delivery route into the delivery_route table (deliveryRouteId is auto-incremented)
    const [deliveryRouteResult] = await db.query(
      "INSERT INTO delivery_route (deliveryRouteName) VALUES (?)",
      [deliveryRouteName]
    );

    res.status(201).json({ message: "Delivery route added successfully" });
  } catch (error) {
    console.error("Error adding delivery route:", error);
    res.status(500).json({ error: "Failed to add delivery route" });
  }
};

// Fetch a single delivery route by name
exports.getDeliveryRouteByName = async (req, res) => {
  const { deliveryRouteName } = req.params;

  try {
    const [deliveryRoute] = await db.query(
      "SELECT * FROM delivery_route WHERE deliveryRouteName = ?",
      [deliveryRouteName]
    );

    if (deliveryRoute.length === 0) {
      return res.status(404).json({ error: "Delivery route not found" });
    }

    res.status(200).json(deliveryRoute[0]);
  } catch (error) {
    console.error("Error fetching delivery route:", error);
    res.status(500).json({ error: "Failed to fetch delivery route" });
  }
};

// Update a delivery route by ID
exports.updateDeliveryRoute = async (req, res) => {
  const { deliveryRouteId } = req.params;
  const { deliveryRouteName } = req.body;

  // Validate required fields
  if (!deliveryRouteName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Update the delivery route in the delivery_route table
    const [deliveryRouteResult] = await db.query(
      "UPDATE delivery_route SET deliveryRouteName = ? WHERE deliveryRouteId = ?",
      [deliveryRouteName, deliveryRouteId]
    );

    if (deliveryRouteResult.affectedRows === 0) {
      return res.status(404).json({ error: "Delivery route not found" });
    }

    res.status(200).json({ message: "Delivery route updated successfully" });
  } catch (error) {
    console.error("Error updating delivery route:", error);
    res.status(500).json({ error: "Failed to update delivery route" });
  }
};

// Delete a delivery route by ID
exports.deleteDeliveryRoute = async (req, res) => {
  const { deliveryRouteId } = req.params;

  try {
    // Delete the delivery route from the delivery_route table
    const [deliveryRouteResult] = await db.query(
      "DELETE FROM delivery_route WHERE deliveryRouteId = ?",
      [deliveryRouteId]
    );

    if (deliveryRouteResult.affectedRows === 0) {
      return res.status(404).json({ error: "Delivery route not found" });
    }

    res.status(200).json({ message: "Delivery route deleted successfully" });
  } catch (error) {
    console.error("Error deleting delivery route:", error);
    res.status(500).json({ error: "Failed to delete delivery route" });
  }
};