const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/auth.middleware");
const { financialSummary } = require("../controllers/balance.controller");

router.get("/:id/balance", authenticateToken, financialSummary);

module.exports = router;