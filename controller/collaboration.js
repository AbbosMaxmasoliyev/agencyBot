const Collaboration = require('../models/collaboration');
const User = require('../models/user');

const createCollaboration = async (req, res) => {
    console.log(req.body);
    try {

        let userId;
        let agreeId;
        console.log(req.body);
        if (req.body.owner) {
            let user = await User.findOne({ userId: req.body.owner })
            userId = user._id

        } else {

            userId = req.body.admin_owner
            if (req.body.admin_agree) {
                agreeId = req.body.admin_agree
            }
        }

        const collaboration = new Collaboration({ ...req.body, owner: userId, agree: agreeId ? agreeId : null });
        await collaboration.save();
        res.status(201).send(collaboration);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

const getAllCollaborations = async (req, res) => {
    try {
        const collaborations = await Collaboration.find();
        console.log(collaborations);
        res.status(200).send(collaborations);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getCollaborationById = async (req, res) => {
    try {
        const collaboration = await Collaboration.findById(req.params.id);
        if (!collaboration) {
            return res.status(404).send();
        }
        res.status(200).send(collaboration);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateCollaborationById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'img', 'price', 'description', 'date', 'agree', "admin_owner", "admin_agree"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    console.log(isValidOperation);
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    if (req.body.admin_owner) {
        req.body.owner = req.body.admin_owner
    }

    if (req.body.admin_agree) {
        req.body.agree = req.body.admin_agree
    }

    try {
        const collaboration = await Collaboration.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(req.body);
        if (!collaboration) {
            return res.status(404).send();
        }
        res.status(200).send(collaboration);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteCollaborationById = async (req, res) => {

    try {
        const collaboration = await Collaboration.findByIdAndDelete(req.params.id);

        if (!collaboration) {
            return res.status(404).send();
        }

        res.status(200).send(collaboration);
    } catch (error) {
        res.status(500).send(error);
    }
};


module.exports = {
    createCollaboration,
    updateCollaborationById,
    getCollaborationById,
    getAllCollaborations,
    deleteCollaborationById
}
