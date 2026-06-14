
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
 * ROUTE DE TEST
 * Ici on définit une première route simple pour vérifier que le serveur fonctionne
 */

app.get("/", (req, res) => {
  res.json({
    message: "Bienvenue sur l'API Tricount"
  });
});

app.get("/health", (req, res) => {
    //req = request (ce que le client envoie)
    //res = response (ce que le serveur renvoie)

    res.json({
        status: "API OK",
        message: "Le serveur fonctionne correctement"
    });
});


/**
 * LANCEMENT DU SERVEUR
 * On démarre l'API sur le port défini
 */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});