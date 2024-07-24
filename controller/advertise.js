const Advertise = require('../models/advertise');
const User = require('../models/user');

const createAdvertise = async (req, res) => {
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

        const advertise = new Advertise({ ...req.body, owner: userId, agree: agreeId ? agreeId : null });
        await advertise.save();
        res.status(201).send(advertise);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

const getAllAdvertises = async (req, res) => {
    try {
        const advertises = await Advertise.find().populate("owner").populate("agree");
        res.status(200).send(advertises);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getAdvertiseById = async (req, res) => {
    try {
        const advertise = await Advertise.findById(req.params.id);
        if (!advertise) {
            return res.status(404).send();
        }
        res.status(200).send(advertise);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateAdvertiseById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'img', 'price', 'description', 'date', 'agree', "admin_owner", "admin_agree", "status"];
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
        const advertise = await Advertise.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(req.body);
        if (!advertise) {
            return res.status(404).send();
        }
        res.status(200).send(advertise);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteAdvertiseById = async (req, res) => {

    try {
        const advertise = await Advertise.findByIdAndDelete(req.params.id);

        if (!advertise) {
            return res.status(404).send();
        }

        res.status(200).send(advertise);
    } catch (error) {
        res.status(500).send(error);
    }
};





module.exports = {
    createAdvertise,
    updateAdvertiseById,
    getAdvertiseById,
    getAllAdvertises,
    deleteAdvertiseById
}
