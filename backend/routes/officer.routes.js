const express = require("express");
const router = express.Router();

const { verifyToken, isAdmin } = require("../middleware/auth.middleware");
const { callNextToken, completeToken } = require("../controllers/officer.controller");

router.post("/call-next", verifyToken, isAdmin, callNextToken);
router.post("/complete", verifyToken, isAdmin, completeToken);

module.exports = router;