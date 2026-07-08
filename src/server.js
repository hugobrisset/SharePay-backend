
// Charge les variables d'environnement depuis le fichier .env
require("dotenv").config();

// On importe notre application Express configuré dasn app.js
const app = require("./app");

/**
 * PORT DU SERVEUR
 * process.env.PORT → vient du fichier .env
 */
const PORT = process.env.PORT || 3000;

/**
 * LANCEMENT DU SERVEUR
 * On démarre l'API sur le port défini
 */
app.listen(PORT || 3000, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});