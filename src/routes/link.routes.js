const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth.middleware");

const { generateInvite, getInviteInfoController, joinByInvite } = require("../controllers/link.controller");

// Full URL: POST http://localhost:3000/groups/:id/invite
router.post("/:id/invite", authenticateToken, generateInvite);

router.get("/:token", authenticateToken, getInviteInfoController);
router.post("/:token/join", authenticateToken, joinByInvite);

module.exports = router;