// On importe Express (le framework pour créer notre API)
const express = require("express");
// On importe CORS (permet au front Angular/Ionic de communiquer avec le back)
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
// On crée une instance d'application Express
const app = express();

/**
 * MIDDLEWARES (intermédiaires)
 * Ce sont des fonctions qui s'exécutent sur chaque requête
 */

// Autorise les requêtes venant d'autres domaines (ex: ton front Angular)
app.use(cors());
// Permet à Express de comprendre les requêtes au format JSON
app.use(express.json());

/** Route  */
app.use("/health", healthRoutes);

// On exporte l'app pour pouvoir l'utiliser dans server.js
module.exports = app;