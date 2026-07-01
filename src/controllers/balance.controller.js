const { getFinancialSummary } = require("../services/balance.service");

const financialSummary = async (req, res) => {
    try {
        const groupId = req.params.id;
        const result = await getFinancialSummary(groupId);

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { financialSummary };