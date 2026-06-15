const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/auth.middleware");
const { create } = require("../controllers/expense.controller");

router.post("/:id/expenses", authenticateToken, create);

module.exports = router;