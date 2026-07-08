/**
 * Pool = gestionnaire de connexions PostgreSQL
 * (plus efficace que créer une connexion à chaque requête)
 */
const {Pool} = require("pg");

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: {
        rejectUnauthorized: false
    }
});

/** Test de connexion immédiat */
pool.connect((err, client, release) => {
    if(err) {
        console.error("Erreur connexion PostgreSQL :", err);
        return;
    }

    console.log("Connexion PostegreSQL réussie.");
    release();
});

module.exports = pool;