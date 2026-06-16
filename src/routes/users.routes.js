const express = require("express")
const router = express.Router();

const {getUsers} = require("../controllers/user.controller");
const authenticateToken = require("../middlewares/auth.middleware");

// Full URL: GET http://localhost:3000/users/
router.get("/", authenticateToken, getUsers);

module.exports = router;