const Barter = require('../models/barter');
const User = require('../models/user');
const logger = require('../utils/logger');

const createBarter = async (req, res) => {
    try {
        let userId;
        console.log(req.body);
        // Ikkinchi added
        if (req.body.owner) {
            let user = await User.findOne({ userId: req.body.owner });
            if (!user) {
                return res.status(404).send({ message: 'Foydalanuvchi topilmadi' });
            }
            userId = user._id;
        } else {
            userId = req.body.admin_owner;
        }

        // agree maydonidagi qiymatlarni tekshirish va to'g'ri formatda ekanligini ta'minlash
        let agree = [];
        if (req.body.agree && Array.isArray(req.body.agree)) {
            agree = req.body.agree.filter(id => mongoose.Types.ObjectId.isValid(id));
        }

        const collaboration = new Barter({ ...req.body, owner: userId, agree });
        console.log(collaboration);
        await collaboration.save();
        res.status(201).send(collaboration);
    } catch (error) {
        logger.error(error)
        res.status(400).send(error);
    }
};

const getAllBarters = async (req, res) => {
    try {
        const barters = await Barter.find().populate("owner").populate("agree");
        res.status(200).send(barters);
    } catch (error) {
        logger.error(error)

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
        logger.error(error)

        res.status(500).send(error);
    }
};

const updateBarterById = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'img', 'price', 'description', 'date', 'agree', "admin_owner", "status", "category"];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    console.log(Object.keys(req.body));
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
        logger.error(error)

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
        logger.error(error)

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
