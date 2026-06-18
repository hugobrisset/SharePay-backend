const express = require("express");
const router = express.Router();

const authenticateToken = require("../middlewares/auth.middleware");
const { create, getAllExpenses, getExpense } = require("../controllers/expense.controller");

// Full URL: POST http://localhost:3000/groups/:id/create-expenses
router.post("/:id/create-expenses", authenticateToken, create);
// Full URL: GET http://localhost:3000/groups/:id/getAllExpense
router.get("/:id/getAllExpense", authenticateToken, getAllExpenses);

router.get("/expenses/:id", authenticateToken, getExpense);

module.exports = router;