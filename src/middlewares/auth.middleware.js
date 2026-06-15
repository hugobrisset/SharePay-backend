const jwt = require("jsonwebtoken");

/** Middleware JWT Vérifie si l'utilisateur est connecté */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if(!authHeader){
        return res.status(401).json({
            error: "Token manquant"
        });
    }

    const token = authHeader.split(" ")[1];

    // format attendu : "Bearer TOKEN"
    if(!token) {
        return res.status(401).json({
            error: "Format token invalide"
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if (err) {
            return res.status(403).json({
                error: "Token invalide ou expiré"
            });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;