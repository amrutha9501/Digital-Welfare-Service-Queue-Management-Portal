const express = require("express");
const router = express.Router();
const { 
    getCounters, 
    createCounter, 
    updateCounter, 
    deleteCounter 
} = require("../controllers/counterController");

router.get("/", getCounters);
router.post("/", createCounter);
router.put("/:id", updateCounter);
router.delete("/:id", deleteCounter);

module.exports = router;