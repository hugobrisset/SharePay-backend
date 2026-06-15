const pool = require("../database/db");


/* GET health */
const getHealth = async (req, res) => {
    try{
        const result = await pool.query("SELECT NOW()");

        res.json({
            status: "API OK",
            dbTime: result.rows[0],
        });
    }
    catch(error){
        res.status(500).json({
            error: "Erreur DB",
            details: error.message,
        });
    }
};

module.exports = {getHealth};