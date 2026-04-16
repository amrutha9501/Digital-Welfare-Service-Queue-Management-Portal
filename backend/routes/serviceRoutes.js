const express = require("express");
const router = express.Router();
const { getAllServices, getServiceById, addService, updateService, toggleService, deleteService, getLiveQueueStatus } = require("../controllers/serviceController");

// Public (Citizen side)
router.get("/", getAllServices);
router.get("/:id", getServiceById);

// Admin Only (You should add your isAdmin middleware here)
router.put("/toggle/:id", toggleService);

router.post("/", addService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

router.get("/services/live-status", getLiveQueueStatus);

module.exports = router;