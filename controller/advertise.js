const Advertise = require('../models/advertise');
const User = require('../models/user');

const createAdvertise = async (req, res) => {
    try {
        let userId;
        console.log(req.body);
        // Ikkinchi added
        if (req.body.owner) {
            let user = await User.findOne({ userId: req.body.owner, active: true });
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

        const collaboration = new Advertise({ ...req.body, owner: userId, agree });
        console.log(collaboration);
        await collaboration.save();
        res.status(201).send(collaboration);
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
