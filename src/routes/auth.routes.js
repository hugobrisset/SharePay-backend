const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/auth.controller");

// Full URL: POST http://localhost:3000/auth/register
router.post("/register", register);
// Full URL: POST http://localhost:3000/auth/login
router.post("/login", login);


module.exports = router;