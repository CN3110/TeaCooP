const express = require("express");
const { 
    getAllTransportRequests, 
    getTransportRequestById,
    addTransportRequest,
    updateTransportRequest,
    deleteTransportRequest, 
} = require("../controllers/requestTransportController");

const router = express.Router(); 

//crud 
router.get("/",getAllTransportRequests);
router.get("/:requestId",getTransportRequestById);
router.post("/",addTransportRequest);
router.put("/:requestId",updateTransportRequest);
router.delete("/:requestId",deleteTransportRequest);


module.exports = router;