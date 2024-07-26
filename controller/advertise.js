const Advertise = require('../models/advertise');
const User = require('../models/user');

const createAdvertise = async (req, res) => {
    console.log(req.body);
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

        const advertise = new Advertise({ ...req.body, owner: userId, agree: [] });
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
        const advertise = await Advertise.findById(req.params.id).populate("owner").populate("agree");
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
    const allowedUpdates = ['title', 'img', 'price', 'description', 'date', 'agree', "admin_owner", "status"];
    console.log(updates)
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));



    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    if (req.body.admin_owner) {
        req.body.owner = req.body.admin_owner
    }



    try {
        const advertise = await Advertise.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
