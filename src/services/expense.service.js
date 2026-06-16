const pool = require("../database/db");
const { isGroupMember } = require("./group.service");

const createExpense = async (groupId, userId, title, amount) => {
    const isMember = await isGroupMember(userId, groupId);
    if (!isMember) {
        throw new Error("Accès refusé au groupe");
    }

    // get all members from group
    const membersResult = await pool.query(
        `SELECT user_id FROM user_groups WHERE group_id = $1 `,
        [groupId]
    );
    const members = membersResult.rows;

    //  create expense
    const expenseResult = await pool.query(
        `INSERT INTO expenses (group_id, user_id, title, amount) VALUES ($1, $2, $3, $4) RETURNING *`,
        [groupId, userId, title, amount]
    );
    const expense = expenseResult.rows[0];

    // Equal split
    const split = amount / members.length
    for (const m of members){
        await pool.query(
            `INSERT INTO expense_participants (expense_id, user_id, amount_owed)
            VALUES ($1, $2, $3)`,
            [expense.id, m.user_id, split]
        );
    }

    return expense;
}

const getGroupExpenses = async (groupId) => {
    const result = await pool.query(
        `SELECT * FROM expenses WHERE group_id = $1`,
        [groupId]

    )
    return result.rows;
}

module.exports = { createExpense, getGroupExpenses };