const { createExpense } = require("../services/expense.service");

const create = async (req, res) => {
    try{

        const groupId = req.params.id;
        const userId = req.user.id;
        const {title, amount} = req.body;

        const expense = await createExpense(groupId, userId, title, amount);
        res.status(201).json(expense);

    }  catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { create };