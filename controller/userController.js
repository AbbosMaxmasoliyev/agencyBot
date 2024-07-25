const User = require('../models/user');
const axios = require("axios")
const Barter = require('../models/barter'); // Adjust the path to your Barter model
const Advertise = require('../models/advertise'); // Adjust the path to your Advertise model
const Announcement = require('../models/announce');
const mongoose = require('mongoose');


const BOT_TOKEN = process.env.BOT_TOKEN
const WEB_APP_URL = process.env.WEB_APP



const deleteUserAndAssociations = async (userId) => {
    try {

        let { _id } = await User.findOne({ userId: userId })
        // Delete associated barter documents
        await Barter.deleteMany({ owner: _id });

        // Delete associated advertise documents
        await Advertise.deleteMany({ owner: _id });

        // Delete associated announcement documents
        await Announcement.deleteMany({ owner: _id });

        // Delete user
        await User.findByIdAndDelete(_id);

        return { success: true }
    } catch (error) {
        return { success: false, error }

    }
};


// Create user
const createUser = async (req, res) => {
    console.log(req.body);
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
};

// Read all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ status: true });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const orderUser = async (req, res) => {
    try {
        const users = await User.find({ status: false });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// Read single user
const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id });
        if (!user) return res.status(404).send({ message: 'User not found' });
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    console.log(req.params.id);
    console.log(req.body)
    try {

        const user = await User.findOneAndUpdate({ userId: req.params.id }, { ...req.body }, { new: true, runValidators: true });
        if (!user) return res.status(404).send({ message: 'User not found' });
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

const updateUseStatus = async (req, res) => {
    console.log(req.params.id);
    let status = req.body.status
    try {
        if (status) {
            const user = await User.findOneAndUpdate({ userId: req.params.id }, { status: true }, { new: true, runValidators: true });
            if (!user) return res.status(404).send({ message: 'User not found' });
            console.log(user.userId);

            await axios.post(
                `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
                {
                    chat_id: user.userId,
                    text: "Ваша личность подтверждена. Вы можете размещать объявления и рекламу",
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Разместить рекламу",
                                    web_app: { url: `${WEB_APP_URL}/user/${user.userId}` }
                                }
                            ]
                        ]
                    }
                }

            )
                .then(res => console.log(res))
                .catch(err => console.log("error", err));





            return res.status(200).send({ user, msg: "sent" });
        }

        return res.status(400).send({ msg: "failed" });

    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};


const updateUserWebInfo = async (req, res) => {
    let userId = req.params.id
    console.log(req.params);
    console.log(Object.keys(req.body).length)
    console.log(req.body);
    if (!Object.keys(req.body).length) {
        return res.status(404).send({ message: 'Fields required' });
    }
    try {
        const user = await User.findOneAndUpdate({ userId: req.params.id }, { web_app: { ...req.body, userTelegramId: Date.now() }, action: req.body.action, status: false }, { new: true });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        res.status(200).send({ success: true });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await deleteUserAndAssociations(req.params.id);
        console.log(user);
        if (!user.success) return res.status(404).send({ message: 'User not found' });

        res.status(200).send({ message: 'User deleted successfully' });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};






module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    updateUserWebInfo,
    deleteUser,
    orderUser,
    updateUseStatus
};
