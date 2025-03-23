const express = require("express");

const {
    getAllDeliveryRoutes, 
    addDeliveryRoute, 
    getDeliveryRouteByName, 
    updateDeliveryRoute,
    deleteDeliveryRoute,
} = require("../controllers/deliveryRoutesController");

const router = express.Router();

// CRUD routes for delivery routes
router.get("/", getAllDeliveryRoutes); 
router.post("/", addDeliveryRoute); 
router.get("/:deliveryRouteName", getDeliveryRouteByName); 
router.put("/:deliveryRouteId", updateDeliveryRoute); 
router.delete("/:deliveryRouteId", deleteDeliveryRoute); 

module.exports = router;