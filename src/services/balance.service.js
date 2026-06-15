const pool = require("../database/db");

const getBalance = async (groupId) => {

    // total paid
    const paidResult = await pool.query(
        `
        SELECT user_id, SUM(amount) AS paid
        FROM expenses
        WHERE group_id = $1
        GROUP BY user_id
        `,
        [groupId]
    );

    // total due
    const owedResult = await pool.query(
        `
        SELECT ep.user_id, SUM(ep.amount_owed) AS owed
        FROM expense_participants ep
        JOIN expenses e ON e.id = ep.expense_id
        WHERE e.group_id = $1
        GROUP BY ep.user_id
        `,
        [groupId]
    );

    const paidMap = {};
    const owedMap = {};

    for (const p of paidResult.rows) {
        paidMap[p.user_id] = Number(p.paid);
    }

    for (const o of owedResult.rows) {
        owedMap[o.user_id] = Number(o.owed);
    }

    const allUsers = new Set([
        ...paidResult.rows.map(r => r.user_id),
        ...owedResult.rows.map(r => r.user_id)
    ])

    const result = [];

    for (const userId of allUsers) {

        const paid = paidMap[userId] || 0;
        const owed = owedMap[userId] || 0;

        result.push({
            userId,
            balance: paid - owed
        });
    }

    return result;
}

module.exports = { getBalance };

