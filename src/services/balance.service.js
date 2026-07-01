const pool = require("../database/db");


const getParticipantBalances  = async (groupId) => {

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

const splitBalances = (balances) => {
    const creditors = [];
    const debtors = [];

    for (const b of balances) {
        if (b.balance > 0) {
            creditors.push({ ...b });
        } else if (b.balance < 0) {
            debtors.push({ ...b, balance: Math.abs(b.balance) });
        }
    }

    return { creditors, debtors };
};

const computeSettlements = (balances) => {
    const { creditors, debtors } = splitBalances(balances);

    const transactions = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        const amount = Math.min(debtor.balance, creditor.balance);

        transactions.push({
            from: {
                id: debtor.participantId,
                name: debtor.name
            },
            to: {
                id: creditor.participantId,
                name: creditor.name
            },
            amount
        });

        debtor.balance -= amount;
        creditor.balance -= amount;

        if (debtor.balance === 0) i++;
        if (creditor.balance === 0) j++;
    }

    return transactions;
}

const getFinancialSummary = async (groupId) => {

    const balances = await getParticipantBalances(groupId);
    const settlements = computeSettlements(balances);

    return {
        balances,
        settlements
    };
};

module.exports = { getFinancialSummary };