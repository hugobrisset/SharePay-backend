const pool = require("../database/db");

/**
 * Create a new group and initialize its participants.
 *
 * This function handles the full group creation workflow:
 * - Creates a new group entry
 * - Adds the creator as a participant linked to their user account
 * - Adds additional participants (as anonymous members if no user account exists)
 * - Ensures all operations are executed within a transaction for consistency
 *
 * @param {string} name - Name of the group
 * @param {number} userId - ID of the user creating the group
 * @param {Array<string>} participants - List of participant names (including potential duplicates of creator)
 * @returns {Object} The created group
 */
const createGroupService = async (name, userId, participants) => {

    const client = await pool.connect();

    try{
        await client.query("BEGIN");

        // CHECK USER EXISTS
        const userResult = await client.query(
            "SELECT id, username FROM users WHERE id = $1",
            [userId]
        );
        if (userResult.rows.length === 0) {
            throw new Error("User not found");
        }

        const username = userResult.rows[0].username;

        // BUSINESS RULE VALIDATION
        if (!Array.isArray(participants)) {
            throw new Error("Participants must be an array");
        }

        if (participants.length === 0) {
            throw new Error("At least one participant is required");
        }

        if (participants.length > 50) {
            throw new Error("Too many participants (max 50)");
        }

        // Validate each participant strictly
        for (const p of participants) {
            if (typeof p !== "string") {
                throw new Error("Each participant must be a string");
            }

            if (p.length === 0) {
                throw new Error("Participant name cannot be empty");
            }

            if (p.length > 50) {
                throw new Error("Participant name too long (max 50 chars)");
            }
        }

        // Detect duplicates
        const lower = participants.map(p => p.toLowerCase());
        const hasDuplicates = new Set(lower).size !== lower.length;
        if (hasDuplicates) {
            throw new Error("Duplicate participants are not allowed");
        }

        // CREATE GROUP
        const groupResult = await client.query(
            "INSERT INTO groups (name) VALUES ($1) RETURNING *",
            [name]
        );
        const group = groupResult.rows[0];

        // Add creator as a participant (linked to user account)
        await client.query(
            "INSERT INTO participants (group_id, user_id, name) VALUES ($1,$2, $3)",
            [group.id, userId, username]
        );

        const filteredParticipants = participants.filter(
            p => p.toLowerCase() !== username.toLowerCase()
        );

        // Add anonymous participants (not linked to user accounts)
        for (const p of filteredParticipants) {
            await client.query(
                "INSERT INTO participants (group_id, name) VALUES ($1, $2)",
                [group.id, p]
            );
        }

        await client.query("COMMIT");

        return group;

    }catch (error) {
        await client.query("ROLLBACK");
        throw error;

    } finally {
        client.release();
    }

}

/**
 * Check whether a user is a member of a group.
 *
 * @param {number} userId - User ID
 * @param {number} groupId - Group ID
 * @returns {boolean} True if user is a participant of the group
 */
const isGroupMember = async (userId, groupId) => {
    const result = await pool.query(
        `SELECT * FROM participants
        WHERE user_id = $1 AND group_id = $2
        `,
        [userId, groupId]
    );

    return result.rows.length > 0;
}

/**
 * Retrieve all groups a user belongs to.
 *
 * This query uses a join on participants to determine membership.
 *
 * @param {number} userId - User ID
 * @returns {Array<Object>} List of groups
 */
const getUserGroups = async (userId) => {
    const result = await pool.query(
        `SELECT DISTINCT g.* FROM groups g
        JOIN participants p  ON g.id = p.group_id
        WHERE p.user_id = $1`,
        [userId]
    );

    return result.rows;
}

/**
 * Retrieve all registered users (linked accounts) in a group.
 *
 * Only participants with a user_id are returned (not anonymous ones).
 *
 * @param {number} groupId - Group ID
 * @returns {Array<Object>} List of users in the group
 */
const getGroupMembers = async (groupId) => {

    const result = await pool.query(
        `
        SELECT u.id, u.username, u.email FROM users u
        JOIN participants p ON u.id = p.user_id
        WHERE p.group_id = $1`,
        [groupId]
    );

    return result.rows;
};

/**
 * Retrieve all participants in a group.
 *
 * This includes both:
 * - Registered users (with user_id)
 * - Anonymous participants (no user_id)
 *
 * @param {number} groupId - Group ID
 * @returns {Array<Object>} List of participants
 */
const getGroupParticipants = async (groupId) => {

    const result = await pool.query(
        `SELECT id, name, user_id FROM participants
        WHERE group_id = $1`,
        [groupId]
    );

    return result.rows;
};

/**
 * Get the participant ID linked to a specific user in a group.
 *
 * @param {number} userId - User ID
 * @param {number} groupId - Group ID
 * @returns {number} Participant ID
 * @throws {Error} If the user is not part of the group
 */
const getParticipantIdService = async (userId, groupId) => {

    const result = await pool.query(
        ` SELECT id FROM participants
        WHERE user_id = $1 AND group_id = $2`,
        [userId, groupId]
    );

    if (result.rows.length === 0) {
        throw new Error("User is not a participant of this group");
    }

    return result.rows[0].id;
};

module.exports = {createGroupService, getUserGroups, getGroupMembers, isGroupMember, getGroupParticipants, getParticipantIdService};