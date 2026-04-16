const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware"); // Adjust path if needed

router.post("/register", registerUser);
router.post("/login", loginUser);

// New Profile Route protected by token verification
router.get("/profile/:id", verifyToken, getUserProfile);

module.exports = router;