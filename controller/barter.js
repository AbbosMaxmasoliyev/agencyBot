const Barter = require('../models/barter');
const User = require('../models/user');

const createBarter = async (req, res) => {
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

        const barter = new Barter({ ...req.body, owner: userId, agree: agreeId ? agreeId : null });
        await barter.save();
        res.status(201).send(barter);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};

const getAllBarters = async (req, res) => {
    try {
        const barters = await Barter.find().populate("owner").populate("agree");
        res.status(200).send(barters);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getBarterById = async (req, res) => {
    try {
        const barter = await Barter.findById(req.params.id).populate("owner").populate("agree");
        if (!barter) {
            return res.status(404).send();
        }
        res.status(200).send(barter);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateBarterById = async (req, res) => {
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
        const barter = await Barter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(req.body);
        if (!barter) {
            return res.status(404).send();
        }
        res.status(200).send(barter);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteBarterById = async (req, res) => {

    try {
        const barter = await Barter.findByIdAndDelete(req.params.id);

        if (!barter) {
            return res.status(404).send();
        }

        res.status(200).send(barter);
    } catch (error) {
        res.status(500).send(error);
    }
};


module.exports = {
    createBarter,
    updateBarterById,
    getBarterById,
    getAllBarters,
    deleteBarterById
}
