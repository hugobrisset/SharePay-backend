const pool = require("../database/db");
const { isGroupMember } = require("./group.service");
const {getParticipantId} = require("./group.service");


const createExpense = async (groupId, userId, title, amount, payerParticipantId, splits) => {
    const client = await pool.connect();
    try{
        await client.query("BEGIN");

        // security check
        const isMember = await isGroupMember(userId, groupId);
        if (!isMember) {
            throw new Error("Accès refusé au groupe");
        }
        if (!splits || splits.length === 0) {
            throw new Error("Splits manquants");
        }

        // create expense
        const expenseResult = await client.query(
            `INSERT INTO expenses (group_id, payer_participant_id, title, amount) VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [groupId, payerParticipantId, title, amount]
        );
        const expense = expenseResult.rows[0];

        // use splits
        for (const split of splits) {
            await client.query(
                `INSERT INTO expense_participants
                 (expense_id, participant_id, amount_owed) VALUES ($1, $2, $3)`,
                [expense.id, split.participantId, split.amount]
            );
        }

        await client.query("COMMIT");
        return expense;

    }catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }
    
}

/**
 * Retrieve all expenses for a given group.
 *
 * This is a simple read operation returning raw expense records.
 *
 * @param {number} groupId - The group whose expenses are requested
 * @returns {Array<Object>} List of expenses
 */
const getGroupExpenses = async (groupId) => {
    const result = await pool.query(
        `SELECT * FROM expenses WHERE group_id = $1`,
        [groupId]

    )
    return result.rows;
}

module.exports = { createExpense, getGroupExpenses };