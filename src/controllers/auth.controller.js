const { registerUser, loginUser, validateRegister } = require("../services/auth.service");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        validateRegister(username, email, password);

        const user = await registerUser(username, email, password);

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1d" }
            );

        res.status(201).json({
            message: "User created successfully",
            user,
            token
        });

    } catch (error) {
        if (error.message === "EMAIL_ALREADY_EXISTS") {
            return res.status(409).json({ error: "Email already exists" });
        }

        if (error.message === "INVALID_EMAIL") {
            return res.status(400).json({ error: "Invalid email" });
        }

        if (error.message === "INVALID_USERNAME") {
            return res.status(400).json({ error: "Invalid username" });
        }

        if (error.message === "WEAK_PASSWORD") {
            return res.status(400).json({ error: "Password too weak" });
        }

        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
};


const login = async (req, res) => {
    try{
        const {email, password} = req.body;
        const result = await loginUser(email, password);

        res.status(200).json(result);
    }
    catch(error){
        res.status(401).json({
            error: error.message
        });
    }
}

module.exports = {register, login};