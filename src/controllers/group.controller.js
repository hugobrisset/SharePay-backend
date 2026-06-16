const { createGroupService, getUserGroups, getGroupMembers, isGroupMember, getGroupParticipants } = require("../services/group.service");

const createGroup = async (req, res) => {
    try{
        const userId = req.user.id;
        const { name, participants } = req.body;

        const group = await createGroupService(name, userId, participants);

        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getGroups = async (req, res) => {
    try{
        const userId = req.user.id;
        const groups = await getUserGroups(userId);
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

const getParticipants = async (req, res) => {

    try {
        const groupId = req.params.id;
        const participants = await getGroupParticipants(groupId);

        res.status(200).json(participants);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });

    }
};

module.exports = { createGroup, getGroups, getMembers, getParticipants};