/**
 * Pool = gestionnaire de connexions PostgreSQL
 * (plus efficace que créer une connexion à chaque requête)
 */
const {Pool} = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "share_pay",
    password: "lGXI849^rlmH8X",
    port: 5432,
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