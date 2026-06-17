const crypto = require("crypto");
const pool = require("../database/db");

/**
 * Create an invitation token for a group.
 *
 * This function generates a secure random token and stores it in the database
 * linked to a specific group. The token can later be shared to allow users
 * to join the group.
 *
 * @param {number} groupId - The ID of the group to invite users into
 * @returns {string} The generated invitation token
 */
const createInvite = async (groupId) => {

  const token = crypto.randomBytes(16).toString("hex");

  await pool.query(
    `INSERT INTO group_invites (group_id, token)
     VALUES ($1, $2)`,
    [groupId, token]
  );

  return token;
};

const getInviteInfo = async (token) => {

    const inviteResult = await pool.query(
        `SELECT g.id, g.name FROM group_invites gi
        JOIN groups g ON g.id = gi.group_id
        WHERE gi.token = $1`,
        [token]
    );

    if (inviteResult.rows.length === 0) {
        throw new Error("Invitation invalide");
    }

    const group = inviteResult.rows[0];

    const participantsResult = await pool.query(
        `SELECT id, name, user_id FROM participants
        WHERE group_id = $1`,
        [group.id]
    );

    return {
        groupId: group.id,
        groupName: group.name,
        participants: participantsResult.rows
    };
};


/**
 * Join a group using an invitation token.
 *
 * This function:
 * - Validates the invitation token
 * - Retrieves the associated group ID
 * - Ensures the user is not already a member of the group
 * - Adds the user to the group if all checks pass
 *
 * @param {number} userId - ID of the user joining the group
 * @param {string} token - Invitation token
 * @returns {Object} The group ID the user joined
 * @throws {Error} If token is invalid or user is already a member
 */
const joinGroupByInvite = async (userId, token, participantId) => {

    const inviteResult = await pool.query(
        `SELECT group_id FROM group_invites
        WHERE token = $1`,
        [token]
    );

    if (inviteResult.rows.length === 0) {
        throw new Error("Invitation invalide");
    }

    const groupId = inviteResult.rows[0].group_id;

    const participantResult = await pool.query(
        `SELECT * FROM participants
        WHERE id = $1`,
        [participantId]
    );

    if (participantResult.rows.length === 0) {
        throw new Error("Participant invalide");
    }

    const participant = participantResult.rows[0];

    if (participant.user_id) {
        throw new Error("Participant déjà associé");
    }

    await pool.query(
        `UPDATE participants SET user_id = $1
        WHERE id = $2 `,
        [userId, participantId]
    );

    return {groupId};
};

module.exports = {createInvite, getInviteInfo, joinGroupByInvite}