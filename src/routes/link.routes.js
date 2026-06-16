const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth.middleware");

const { generateInvite, joinByInvite } = require("../controllers/link.controller");

// Full URL: POST http://localhost:3000/groups/:id/invite
router.post("/:id/invite", authenticateToken, generateInvite);
// Full URL: POST http://localhost:3000/groups/join/:token
router.post("/join/:token", authenticateToken, joinByInvite);

module.exports = router;