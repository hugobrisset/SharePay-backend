const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth.middleware");

const { createGroup, getGroups, getMembers, getParticipants } = require("../controllers/group.controller");

// Full URL: POST http://localhost:3000/groups/createGroup
router.post("/createGroup",authenticateToken, createGroup);
// Full URL: GET http://localhost:3000/groups/getUserGroups
router.get("/getUserGroups",authenticateToken, getGroups);
// Full URL: GET http://localhost:3000/groups/:id/members
router.get("/:id/members",authenticateToken, getMembers);
// Full URL: GET http://localhost:3000/groups/:id/participants
router.get("/:id/participants", authenticateToken, getParticipants);

module.exports = router;