const pool = require("../database/db");

const getUsers = async (req, res) => {
    try{
        const result = await pool.query("SELECT * FROM users");

        res.json(result.rows);
    }
    catch(error){
        res.status(500).json({
            error: "Erreur récupération users",
            details: error.message
        });
    }
}

module.exports = {getUsers};