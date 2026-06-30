const { createExpense, getGroupExpenses, getExpenseByID, updateExpense } = require("../services/expense.service");

const create = async (req, res) => {
    try{

        const groupId = req.params.id;
        const userId = req.user.id;
        const { title, amount, payerParticipantId, splitMode, splits } = req.body;

        
        if (!title || typeof title !== "string") throw new Error("Title invalide");
        if (!amount || typeof amount !== "number") throw new Error("Amount invalide");
        if (!Array.isArray(splits)) throw new Error("Splits invalides");

        const validModes = ["equal", "exact", "parts"];
        if (!validModes.includes(splitMode)) throw new Error("Split mode invalide");

        const expense = await createExpense(groupId, userId, title, amount, payerParticipantId, splitMode, splits);
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

const update = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const userId = req.user.id;

    console.log(req.body);
    const { title, amount, payerParticipantId, splitMode, splits } = req.body;

    console.log(payerParticipantId);

    if (!title || typeof title !== "string")
      throw new Error("Title invalide");

    if (!amount || typeof amount !== "number")
      throw new Error("Amount invalide");

    if (!Array.isArray(splits))
      throw new Error("Splits invalides");

    const expense = await updateExpense(
      expenseId,
      userId,
      title,
      amount,
      payerParticipantId,
      splitMode,
      splits
    );

    res.json(expense);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { create, getAllExpenses, getExpense, update };