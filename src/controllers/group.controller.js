const { createGroup, joinGroup, getUserGroups, getGroupMembers, isGroupMember } = require("../services/group.service");

const create = async (req, res) => {
    try{
        const {name} = req.body;

        const userId = req.user.id;

        const group = await createGroup(name, userId);
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const join = async (req, res) => {
    try{
        const userId = req.user.id;
        const {groupId} = req.body;

        const result = await joinGroup(userId, groupId);
        res.status(201).json(result);

    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getGroups = async (req, res) => {
    try{
        const userId = req.user.id;
        const groups = await getUserGroup(userId);
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
 
}

const getMembers = async (req, res) => {
    try{
        const userId = req.user.id;
        const groupeId = req.params.id;

        const isMember = await isGroupMember(userId, groupeId);
        if (!isMember) {
            return res.status(403).json({
                error: "Accès refusé"
            });
        }

        const members = await getGroupMembers(groupeId);
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

module.exports = { create, join, getGroups, getMembers};