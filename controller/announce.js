const Announce = require('../models/announce');
const User = require('../models/user');

const createAnnounce = async (req, res) => {
    try {

        let userId;
        let agreeId;
        if (req.body.owner) {
            let user = await User.findOne({ userId: req.body.owner })
            userId = user._id

        } else {

            userId = req.body.admin_owner
            if (req.body.admin_agree) {
                agreeId = req.body.admin_agree
            }
        }

        const announce = new Announce({ ...req.body, owner: userId, agree: agreeId ? agreeId : null });
        await announce.save();
        res.status(201).send(announce);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

const getAllAnnounces = async (req, res) => {
    try {
        const announces = await Announce.find().populate("owner").populate("agree");
        res.status(200).send(announces);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getAnnounceById = async (req, res) => {
    try {
        const announce = await Announce.findById(req.params.id).populate("owner").populate("agree");
        if (!announce) {
            return res.status(404).send();
        }
        res.status(200).send(announce);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateAnnounceById = async (req, res) => {
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
        const announce = await Announce.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(req.body);
        if (!announce) {
            return res.status(404).send();
        }
        res.status(200).send(announce);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteAnnounceById = async (req, res) => {

    try {
        const announce = await Announce.findByIdAndDelete(req.params.id);

        if (!announce) {
            return res.status(404).send();
        }

        res.status(200).send(announce);
    } catch (error) {
        res.status(500).send(error);
    }
};


module.exports = {
    createAnnounce,
    updateAnnounceById,
    getAnnounceById,
    getAllAnnounces,
    deleteAnnounceById
}
