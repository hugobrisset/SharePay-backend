const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/auth.middleware");
const { balance } = require("../controllers/balance.controller");

// Full URL: GET http://localhost:3000/groups/:id/balance
router.get("/:id/balance", authenticateToken, balance);

module.exports = router;