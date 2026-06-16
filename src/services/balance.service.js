const pool = require("../database/db");

/**
 * Calculate the financial balance of each participant in a group.
 *
 * This function computes how much each participant:
 * - Has paid in total
 * - Owes in total
 * - Their final balance (paid - owed)
 *
 * It aggregates data from expenses and expense participants,
 * then merges everything into a per-user balance summary.
 *
 * @param {number} groupId - The ID of the group to compute balances for
 * @returns {Array<Object>} List of participants with their computed balance
 */
const getBalance = async (groupId) => {

     /** Total amount paid by each participant  */
    const paidResult = await pool.query(
        `SELECT e.payer_participant_id AS participant_id, SUM(e.amount) AS paid FROM expenses e
        WHERE e.group_id = $1
        GROUP BY e.payer_participant_id`,
        [groupId]
    );

    /** Total amount owed by each participant */
    const owedResult = await pool.query(
        `SELECT ep.participant_id,  SUM(ep.amount_owed) AS owed FROM expense_participants ep
        JOIN expenses e ON e.id = ep.expense_id
        WHERE e.group_id = $1
        GROUP BY ep.participant_id `,
        [groupId]
    );

    const paidMap = {};
    const owedMap = {};

    for (const p of paidResult.rows) {
        paidMap[p.participant_id] = Number(p.paid);
    }

    for (const o of owedResult.rows) {
        owedMap[o.participant_id] = Number(o.owed);
    }

    // Retrieve all participants of the group
    const participantsResult = await pool.query(
        ` SELECT id, name FROM participants
        WHERE group_id = $1
        `,
        [groupId]
    );
    const participants = participantsResult.rows;

    // Compute final balance per participant
    return participants.map(p => {

        const paid = paidMap[p.id] || 0;
        const owed = owedMap[p.id] || 0;

        return {
            participantId: p.id,
            name: p.name,
            balance: paid - owed
        };
    });
};

module.exports = { getBalance };