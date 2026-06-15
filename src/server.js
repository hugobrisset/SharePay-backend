
// Charge les variables d'environnement depuis le fichier .env
require("dotenv").config();

// On importe notre application Express configuré dasn app.js
const app = require("./app");

/**
 * PORT DU SERVEUR
 * process.env.PORT → vient du fichier .env
 */
const PORT = process.env.PORT;

/**
 * LANCEMENT DU SERVEUR
 * On démarre l'API sur le port défini
 */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});