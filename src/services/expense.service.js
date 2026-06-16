const pool = require("../database/db");
const { isGroupMember } = require("./group.service");
const {getParticipantId} = require("./group.service");

/**
 * Create a new expense in a group and automatically split it between all members.
 *
 * This function:
 * - Validates that the user belongs to the group
 * - Retrieves the participant ID linked to the user
 * - Creates a new expense record in a transaction
 * - Retrieves all group members
 * - Splits the expense equally between all participants
 * - Inserts per-user owed amounts in expense_participants
 *
 * The whole operation is wrapped in a DB transaction to ensure consistency.
 *
 * @param {number} groupId - The group in which the expense is created
 * @param {number} userId - The user creating the expense (payer)
 * @param {string} title - Title/description of the expense
 * @param {number} amount - Total amount of the expense
 * @returns {Object} The created expense record
 */
const createExpense = async (groupId, userId, title, amount) => {
    const client = await pool.connect();
    try{
        await client.query("BEGIN");

        const participantId = await getParticipantId(userId, groupId);

        const isMember = await isGroupMember(userId, groupId);
        if (!isMember) {
            throw new Error("Accès refusé au groupe");
        }

        const membersResult = await client.query(
            `SELECT id FROM participants WHERE group_id = $1 `,
            [groupId]
        );
        const members = membersResult.rows;

        // Insert the main expense record (the total amount paid by one participant).
        const expenseResult = await client.query(
            `INSERT INTO expenses (group_id, payer_participant_id, title, amount) VALUES ($1, $2, $3, $4) RETURNING *`,
            [groupId, participantId, title, amount]
        );
        const expense = expenseResult.rows[0];

        // Create a record for each participant's owed amount.
        const split = amount / members.length
        for (const m of members){
            await client.query(
                `INSERT INTO expense_participants (expense_id, participant_id, amount_owed) VALUES ($1, $2, $3)`,
                [expense.id, m.id, split]
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