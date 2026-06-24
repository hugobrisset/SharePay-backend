const { createExpense, getGroupExpenses, getExpenseByID } = require("../services/expense.service");

const create = async (req, res) => {
    try{

        const groupId = req.params.id;
        const userId = req.user.id;
        const { title, amount, payerId, splits } = req.body;

        if (!title || typeof title !== "string") throw new Error("Title invalide");
        if (!amount || typeof amount !== "number") throw new Error("Amount invalide");
        if (!Array.isArray(splits)) throw new Error("Splits invalides");

        const expense = await createExpense(groupId, userId, title, amount, payerId, splits);
        res.status(201).json(expense);

    }  catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getAllExpenses = async (req, res) => {
    try {
        const groupId = req.params.id;
        const expenses = await getGroupExpenses(groupId);

        res.status(200).json(expenses);

    } catch (error) {
        res.status(500).json({ error: error.message });

    }
};

const getExpense = async (req, res) => {
  try {
    const userId = req.user.id;
    const expenseId = req.params.id;

    const expense = await getExpenseByID(expenseId, userId);

    res.json(expense);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { create, getAllExpenses, getExpense };