const { createGroupService, getUserGroups, getGroupMembers, isGroupMember, getGroupParticipants, getParticipantIdService } = require("../services/group.service");

const createGroup = async (req, res) => {
    try{
        const userId = req.user.id;

        // Ensure user is authenticated
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        let { name, participants } = req.body;

        // Validate group name
        if (!name || typeof name !== "string") {
            return res.status(400).json({ error: "Group name is required" });
        }

        name = name.trim();

        if (name.length < 2 || name.length > 50) {
            return res.status(400).json({
                error: "Group name must be between 2 and 50 characters"
            });
        }

        // Call service
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

const isMember = async (req, res) => {
    try{
        const userId = req.user.id;
        const groupId = req.params.id;

        const result = await isGroupMember(userId, groupId);
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getParticipantId = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.user.id;

        const participantId = await getParticipantIdService(groupId, userId);

        res.status(200).json({ participantId });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { createGroup, getGroups, getMembers, getParticipants, isMember, getParticipantId};