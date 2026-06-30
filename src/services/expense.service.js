const pool = require("../database/db");
const { isGroupMember } = require("./group.service");


const createExpense = async (groupId, userId, title, amount, payerParticipantId, splitMode, splits) => {
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
            `INSERT INTO expenses (group_id, payer_participant_id, title, amount, split_mode) VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [groupId, payerParticipantId, title, amount, splitMode]
        );
        const expense = expenseResult.rows[0];

        // insert splits
        for (const split of splits) {
            await client.query(
                `INSERT INTO expense_participants
                 (expense_id, participant_id, amount_owed, parts) VALUES ($1, $2, $3, $4)`,
                [expense.id, split.participantId, split.amount, split.parts ?? null]
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
            `SELECT ep.participant_id, ep.amount_owed, ep.parts, p.name FROM expense_participants ep
            JOIN participants p ON p.id = ep.participant_id
            WHERE ep.expense_id = $1 `,
            [expenseId]
        );

        const splits = splitsResult.rows.map(s => ({
            participantId: s.participant_id,
            participantName: s.name,
            amount: Number(s.amount_owed),
            parts: s.parts ?? null
        }));

        const payer = payerResult.rows[0]
            ? {
                id: payerResult.rows[0].id,
                name: payerResult.rows[0].name
            }
            : null;

        return {
            id: expense.id,
            groupId: expense.group_id,
            title: expense.title,
            amount: Number(expense.amount),
            splitMode: expense.split_mode,
            payer,
            splits
        };
    
    } finally {
        client.release();
    }
}

const updateExpense = async (
    expenseId,
    userId,
    title,
    amount,
    payerParticipantId,
    splitMode,
    splits
) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // récupérer la dépense
        const expenseResult = await client.query(
            `SELECT * FROM expenses WHERE id = $1`,
            [expenseId]
        );

        if (expenseResult.rows.length === 0)
            throw new Error("Expense introuvable");

        const expense = expenseResult.rows[0];

        // vérifier les droits
        const isMember = await isGroupMember(userId, expense.group_id);

        if (!isMember)
            throw new Error("Accès refusé");

        // vérifier les participants
        const participantIds = splits.map(s => s.participantId);

        const check = await client.query(
            `SELECT id FROM participants
             WHERE group_id = $1 AND id = ANY($2::int[])`,
            [expense.group_id, participantIds]
        );

        //check payer
        console.log(payerParticipantId);
        const payerCheck = await client.query(
            `SELECT id FROM participants WHERE id = $1 AND group_id = $2`,
            [payerParticipantId, expense.group_id]
        );

        if (payerCheck.rows.length === 0) {
            throw new Error("Payer invalide");
        }

        if (check.rows.length !== participantIds.length)
            throw new Error("Participants invalides");

        // vérifier le total
        const totalSplit = splits.reduce((sum, s) => sum + Number(s.amount), 0);

        if (Math.abs(totalSplit - amount) > 0.01)
            throw new Error("Total invalide");

        // update expense
        await client.query(
            `UPDATE expenses
             SET title = $1,
                 amount = $2,
                 payer_participant_id = $3,
                 split_mode = $4
             WHERE id = $5`,
            [
                title,
                amount,
                payerParticipantId,
                splitMode,
                expenseId
            ]
        );

        // supprimer anciens splits
        await client.query(
            `DELETE FROM expense_participants
             WHERE expense_id = $1`,
            [expenseId]
        );

        // recréer les splits
        for (const split of splits) {

            await client.query(
                `INSERT INTO expense_participants
                (expense_id, participant_id, amount_owed, parts)
                VALUES ($1,$2,$3, $4)`,
                [
                    expenseId,
                    split.participantId,
                    split.amount,
                    split.parts ?? null
                ]
            );
        }

        await client.query("COMMIT");

        return { success: true };

    } catch (err) {

        await client.query("ROLLBACK");
        throw err;

    } finally {

        client.release();

    }
};

module.exports = { createExpense, getGroupExpenses, getExpenseByID, updateExpense };