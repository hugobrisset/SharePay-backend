const jwt = require("jsonwebtoken");

/**
 * JWT Authentication Middleware
 *
 * This middleware verifies that the incoming request contains a valid JWT token.
 *
 * It performs the following checks:
 * - Ensures the Authorization header exists
 * - Extracts the token from the "Bearer <token>" format
 * - Verifies the token signature and expiration using JWT secret
 * - Attaches decoded user payload to req.user if valid
 *
 * If authentication fails, it returns an appropriate HTTP error response:
 * - 401: Missing or malformed token
 * - 403: Invalid or expired token
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if(!authHeader){
        return res.status(401).json({
            error: "Token manquant"
        });
    }

    const token = authHeader.split(" ")[1];

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