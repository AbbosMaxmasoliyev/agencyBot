const Collaboration = require('../models/collaboration');
const User = require('../models/user');
const logger = require('../utils/logger');

const createCollaboration = async (req, res) => {
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

        const collaboration = new Collaboration({ ...req.body, owner: userId, agree });
        console.log(collaboration);
        await collaboration.save();
        res.status(201).send(collaboration);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
};
const getAllCollaborations = async (req, res) => {
    try {
        const collaborations = await Collaboration.find().populate("owner").populate("agree");
        console.log(collaborations);
        res.status(200).send(collaborations);
    } catch (error) {
        logger.error(error)
        res.status(500).send(error);
    }
};


const getMyCollaborations = async (req, res) => {
    try {
        const collaborations = await Collaboration.find({ userId: req.params.userId }).populate("owner").populate("agree");
        console.log(collaborations);
        res.status(200).send(collaborations);
    } catch (error) {
        logger.error(error)
        res.status(500).send(error);
    }
};

const getCollaborationById = async (req, res) => {
    try {
        const collaboration = await Collaboration.findById(req.params.id).populate("owner").populate("agree");
        if (!collaboration) {
            return res.status(404).send();
        }
        res.status(200).send(collaboration);
    } catch (error) {
        logger.error(error)
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



    try {
        const collaboration = await Collaboration.findByIdAndUpdate(req.params.id, req.body, { new: true });
        console.log(req.body);
        if (!collaboration) {
            return res.status(404).send();
        }
        res.status(200).send(collaboration);
    } catch (error) {
        logger.error(error)
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
        logger.error(error)
        res.status(500).send(error);
    }
};


module.exports = {
    createCollaboration,
    updateCollaborationById,
    getCollaborationById,
    getAllCollaborations,
    deleteCollaborationById,
    getMyCollaborations
}
