const { getBalance } = require("../services/balance.service");

const balance = async (req, res) => {

    try {

        const groupId = req.params.id;
        const result = await getBalance(groupId);

        res.status(200).json(result);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

module.exports = { balance };