const pool = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Register a new user in the database.
 * 
 * This function handles user creation by:
 * - Normalizing the email to ensure consistency
 * - Hashing the password using bcrypt for security
 * - Inserting the new user into the PostgreSQL database
 * - Returning the created user record
 *
 * @param {string} username - The user's display name
 * @param {string} email - The user's email address (will be normalized to lowercase)
 * @param {string} password - The user's plain text password
 * @returns {Object} The newly created user record
 */
const registerUser = async (username, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const normalizedEmail = email.toLowerCase();

    const result = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, normalizedEmail, hashedPassword]
    );

    return result.rows[0];
};

/**
 * Authenticate a user and generate a JWT token.
 *
 * This function handles the login process by:
 * - Finding the user by email in the database
 * - Verifying that the user exists
 * - Comparing the provided password with the stored hashed password
 * - Generating a JWT token if authentication succeeds
 *
 * @param {string} email - The user's email address
 * @param {string} password - The user's plain text password
 * @returns {Object} An object containing user info and JWT token
 * @throws {Error} If user is not found or password is invalid
 */
const loginUser = async (email, password) => {

    const normalizedEmail = email.toLowerCase();

    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [normalizedEmail]
    );

    const user = result.rows[0];

    if(!user){
        throw new Error("Utilisateur introuvable");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) {
        throw new Error("Mot de passe incorrect");
    }

    // Generate JWT token for authenticated session
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h"}
    );

    // Return safe user data + token
    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
        },
        token
    };
};

module.exports = {registerUser, loginUser};