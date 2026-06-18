const pool = require("../database/db");
const { isGroupMember } = require("./group.service");
const {getParticipantId} = require("./group.service");


const createExpense = async (groupId, userId, title, amount, payerParticipantId, splits) => {
    const client = await pool.connect();
    try{
        await client.query("BEGIN");

        // check payer
        const isMember = await isGroupMember(userId, groupId);
        if (!isMember) {
            throw new Error("Accès refusé au groupe");
        }
        
        if (!splits || splits.length === 0) {
            throw new Error("Splits manquants");
        }

        // check participants
        const participantIds = splits.map(s => s.participantId);
        const check = await client.query(
            `SELECT id FROM participants 
            WHERE group_id = $1 AND id = ANY($2::int[])`,
            [groupId, participantIds]
        );

        if (check.rows.length !== participantIds.length) {
            throw new Error("Splits invalides (participants hors groupe)");
        }

        // validate amounts + total
        for (const split of splits) {
            if (
                typeof split.amount !== "number" || split.amount < 0 || !Number.isFinite(split.amount)
            ) {
                throw new Error("Montant invalide dans les splits");
            }
        }

        const totalSplit = splits.reduce((sum, s) => sum + Number(s.amount), 0);

        const diff = Math.abs(totalSplit - amount);
        if (diff > 0.01) {
            throw new Error("La somme des splits ne correspond pas au montant total");
        }

        // create expense
        const expenseResult = await client.query(
            `INSERT INTO expenses (group_id, payer_participant_id, title, amount) VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [groupId, payerParticipantId, title, amount]
        );
        const expense = expenseResult.rows[0];

        // insert splits
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

const getExpenseByID = async (expenseId, userId) => {
    const client = await pool.connect();
    try {
        // get expense and check membership
        const expenseResult = await client.query(
            `SELECT e.*, g.id as group_id FROM expenses e
            JOIN groups g ON g.id = e.group_id
            WHERE e.id = $1`,
            [expenseId]
        );
        if(expenseResult.rows.length == 0){
            throw new Error("Expense introuvable");
        }

        const expense = expenseResult.rows[0];

        const isMember = await isGroupMember(userId, expense.group_id);
        if (!isMember) {
            throw new Error("Accès refusé");
        }

        // payer info
        const payerResult = await client.query(
            `SELECT id, name FROM participants WHERE id = $1 `,
            [expense.payer_participant_id]
        );

        // splits
        const splitsResult = await client.query(
        `SELECT ep.amount_owed, p.id, p.name FROM expense_participants ep
        JOIN participants p ON p.id = ep.participant_id
        WHERE ep.expense_id = $1 `,
        [expenseId]
        );
        return {
            ...expense,
            payer: payerResult.rows[0],
            splits: splitsResult.rows
        };
    
    } finally {
        client.release();
    }
}

module.exports = { createExpense, getGroupExpenses, getExpenseByID };