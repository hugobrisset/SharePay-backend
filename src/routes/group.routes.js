const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth.middleware");

const { create, join, getGroups, getMembers } = require("../controllers/group.controller");

/** POST /auth/register */
router.post("/create",authenticateToken, create);
router.post("/join",authenticateToken, join);
router.get("/getUserGroups",authenticateToken, getGroups);
router.get("/:id/members",authenticateToken, getMembers);

module.exports = router;