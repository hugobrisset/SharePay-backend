const pool = require("../database/db");

const isGroupMember = async (userId, groupId) => {
    const result = await pool.query(
        `
        SELECT * FROM user_groups
        WHERE user_id = $1 AND group_id = $2
        `,
        [userId, groupId]
    );

    return result.rows.length > 0;
}

/** CREATE GROUP */
const createGroup = async (name, userId) => {
    const groupResult = await pool.query(
        "INSERT INTO groups (name) VALUES ($1) RETURNING *",
        [name]
    );

    const group = groupResult.rows[0];

    //link user to group
    await pool.query(
        "INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)",
        [userId, group.id]
    )

    return group;
}

const joinGroup = async (userId, groupId) => {
    // check group existance
    const groupCheck = await pool.query(
        "SELECT * FROM groups WHERE id = $1",
        [groupId]
    );

    if(groupCheck.rows.length === 0){
        throw new Error("Groupe Introuvable");
    }

    // check if not already members
    const alreadyMember = await pool.query(
        "SELECT * FROM user_groups WHERE user_id = $1 AND group_id = $2",
        [userId, groupId]
    );

    if (alreadyMember.rows.length > 0) {
        throw new Error("Déjà membre du groupe");
    }

    // insert into group
    await pool.query(
        "INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2)",
        [userId, groupId]
    );

    return {message: "Groupe rejoint avec succes"};

}

const getUserGroups = async (userId) => {
    const result = await pool.query(
        `
        SELECT g.*
        FROM groups g
        JOIN user_groups ug
        ON g.id = ug.group_id
        WHERE ug.user_id = $1
        `,
        [userId]
    );

    return result.rows;
}

const getGroupMembers = async (groupId) => {

    const result = await pool.query(
        `
        SELECT u.id, u.username, u.email
        FROM users u
        JOIN user_groups ug
        ON u.id = ug.user_id
        WHERE ug.group_id = $1
        `,
        [groupId]
    );

    return result.rows;
};

module.exports = {createGroup, joinGroup, getUserGroups, getGroupMembers, isGroupMember};