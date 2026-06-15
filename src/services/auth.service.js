const pool = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/** INSCRIPTION UTILISATEUR */
const registerUser = async (username, email, password) => {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into db
    const result = await pool.query(
        "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, hashedPassword]
    );

    return result.rows[0];
};

//** LOGIN */
const loginUser = async (email, password) => {

    // research user by mail
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );

    const user = result.rows[0];

    if(!user){
        throw new Error("Utilisateur introuvable");
    }

    // compare password
    const isValid = await bcrypt.compare(password, user.password);

    if(!isValid) {
        throw new Error("Mot de passe incorrect");
    }

    // generate JWT token
    const token = jwt.sign(
        {
            id: user.id,
            email: user.email
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h"}
    );

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