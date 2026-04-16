const express = require("express");
const router = express.Router();
const { generateToken, getUserTokens, getLiveQueueStatus } = require("../controllers/tokenController");

// POST /api/tokens/generate
router.post("/generate", generateToken);

// GET /api/tokens/user/:userId (Crucial for the frontend check)
router.get("/user/:userId", getUserTokens);


module.exports = router;