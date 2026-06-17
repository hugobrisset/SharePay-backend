const {createInvite, getInviteInfo, joinGroupByInvite} = require("../services/link.service");

const generateInvite = async (req, res) => {

  try {
    const groupId = req.params.id;
    const token = await createInvite(groupId);

    res.status(201).json({
      message: "Invite created",
      token: token,
      link: `http://localhost:3000/groups/join/${token}`
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

const getInviteInfoController = async (req, res) => {
    try {
        const { token } = req.params;

        const result = await getInviteInfo(token);

        res.json(result);

    } catch (error) {

        res.status(400).json({
            error: error.message
        });
    }
};

const joinByInvite = async (req, res) => {

    try {
        const userId = req.user.id;
        const token = req.params.token;
        const { participantId } = req.body;

        const result = await joinGroupByInvite(userId,token, participantId);

        res.status(200).json(result);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }
};

module.exports = { generateInvite, joinByInvite, getInviteInfoController };