const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/auth.middleware");
const { create, getAllExpenses } = require("../controllers/expense.controller");

router.post("/:id/create-expenses", authenticateToken, create);
router.get("/group/:id", authenticateToken, getAllExpenses);

module.exports = router;