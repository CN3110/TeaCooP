const db = require("../config/database");

// Fetch all delivery routes
exports.getAllDeliveryRoutes = async (req, res) => {
  try {
    const [routes] = await db.query("SELECT * FROM delivery_route");
    console.log("Fetched routes:", routes); // Debugging log
    res.status(200).json(routes);
  } catch (error) {
    console.error("Error fetching delivery routes:", error);
    res.status(500).json({ error: "Failed to fetch delivery routes" });
  }
};

// Add a new delivery route
exports.addDeliveryRoute = async (req, res) => {
  const { delivery_routeName } = req.body;

  console.log("Request body:", req.body); // Debugging log

  if (!delivery_routeName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO delivery_route (delivery_routeName) VALUES (?)",
      [delivery_routeName]
    );

    console.log("Insert result:", result); // Debugging log

    res.status(201).json({
      message: "Delivery route added successfully",
      delivery_routeId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding delivery route:", error);
    res.status(500).json({ error: "Failed to add delivery route" });
  }
};

// Fetch a single delivery route by name
exports.getDeliveryRouteByName = async (req, res) => {
  const { delivery_routeName } = req.params;

  console.log("Fetching route by name:", delivery_routeName); // Debugging log

  try {
    const [route] = await db.query(
      "SELECT * FROM delivery_route WHERE delivery_routeName = ?",
      [delivery_routeName]
    );

    console.log("Fetched route:", route); // Debugging log

    if (route.length === 0) {
      return res.status(404).json({ error: "Delivery route not found" });
    }

    res.status(200).json(route[0]);
  } catch (error) {
    console.error("Error fetching delivery route:", error);
    res.status(500).json({ error: "Failed to fetch delivery route" });
  }
};

// Update a delivery route by ID
exports.updateDeliveryRoute = async (req, res) => {
  const delivery_routeId = parseInt(req.params.delivery_routeId, 10);
  const { delivery_routeName } = req.body;

  console.log("Request body:", req.body); // Debugging log

  if (!delivery_routeName) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const [result] = await db.query(
      "UPDATE delivery_route SET delivery_routeName = ? WHERE delivery_routeId = ?",
      [delivery_routeName, delivery_routeId]
    );

    console.log("Update result:", result); // Debugging log

    if (result.affectedRows === 0) {
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
  const delivery_routeId = parseInt(req.params.delivery_routeId, 10);

  console.log("Deleting route with ID:", delivery_routeId); // Debugging log

  try {
    const [result] = await db.query(
      "DELETE FROM delivery_route WHERE delivery_routeId = ?",
      [delivery_routeId]
    );

    console.log("Delete result:", result); // Debugging log

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Delivery route not found" });
    }

    res.status(200).json({ message: "Delivery route deleted successfully" });
  } catch (error) {
    console.error("Error deleting delivery route:", error);
    res.status(500).json({ error: "Failed to delete delivery route" });
  }
};