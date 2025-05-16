const express = require("express");
const router = express.Router();
const deliveryRoutesController = require("../controllers/deliveryRoutesController");

// CRUD routes for delivery routes
router.get("/", deliveryRoutesController.getAllDeliveryRoutes);
router.post("/", deliveryRoutesController.addDeliveryRoute);
router.get("/:delivery_routeName", deliveryRoutesController.getDeliveryRouteByName);
router.put("/:delivery_routeId", deliveryRoutesController.updateDeliveryRoute);
router.delete("/:delivery_routeId", deliveryRoutesController.deleteDeliveryRoute);
module.exports = router;