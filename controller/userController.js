const User = require('../models/user');
const axios = require("axios")
const Barter = require('../models/barter'); // Adjust the path to your Barter model
const Advertise = require('../models/advertise'); // Adjust the path to your Advertise model
const Announcement = require('../models/announce');
const mongoose = require('mongoose');
const { sendMessageToGroup, sendMessageToUser } = require('../src/core/bot');
const { textGetWithLanguage } = require("../utils/text");
const { keyboard } = require('telegraf/markup');

const BOT_TOKEN = process.env.BOT_TOKEN
const WEB_APP_URL = process.env.WEB_APP



const deleteUserAndAssociations = async (userId) => {
    try {

        await User.findOneAndUpdate({ userId: userId }, { active: false })
        // Delete associated barter documents
        // await Barter.deleteMany({ owner: _id });

        // // Delete associated advertise documents
        // await Advertise.deleteMany({ owner: _id });

        // // Delete associated announcement documents
        // await Announcement.deleteMany({ owner: _id });

        // // Delete user
        // await User.findByIdAndDelete(_id);

        return { success: true }
    } catch (error) {
        return { success: false, error }

    }
};


// Create user
const createUser = async (req, res) => {
    console.log(req.body, "=> Usercreate");
    try {
        const user = new User(req.body);
        await user.save();

        sendMessageToGroup(`Yangi User yaratildi`)
        console.log(`Yangi User yaratildi`);

        res.status(201).send(user);
    } catch (error) {
        console.log(error);

        res.status(400).send({ message: error.message });
    }
};

// Read all users
const getUsers = async (req, res) => {
    const { page = 1, item = 10, role, search } = req.query; // default qiymatlar

    let query = { status: true, active: true }; // doimiy filter
    role ? query = { ...query, "web_app.role": role } : null
    console.log(req.query, "=> query");


    console.log(query);

    try {
        const totalUsers = await User.countDocuments({ ...query });
        const users = await User.find({ query })
            .skip((page - 1) * item)
            .limit(parseInt(item));
        console.log(users);

        res.status(200).send({ users, total: totalUsers });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const getUsersAdmin = async (req, res) => {
    // default qiymatlar

    let query = { status: true }; // doimiy filter
    console.log(req.query, "=> query");


    console.log(query);

    try {
        const totalUsers = await User.countDocuments();
        const users = await User.find({ status: true, active: true })
        console.log(users);

        res.status(200).send({ users, total: totalUsers });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


const orderUser = async (req, res) => {
    try {
        const users = await User.find({ status: false, active: true });
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// Read single user
const getUser = async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.id, active: true });
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

        const user = await User.findOneAndUpdate({ userId: req.params.id, active: true }, { ...req.body }, { new: true, runValidators: true });
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
            const user = await User.findOneAndUpdate({ userId: req.params.id, active: true }, { status: true }, { new: true, runValidators: true });
            if (!user) return res.status(404).send({ message: 'User not found' });
            console.log(user.userId);
            await sendMessageToUser(textGetWithLanguage(user, "saved_success"), user.userId, {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: textGetWithLanguage(user, "open_web_app"),
                                web_app: { url: `${WEB_APP_URL}/user/${user.userId}` }
                            }
                        ]
                    ],
                    resize_keyboard: true
                }
            },)




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
        const user = await User.findOneAndUpdate({ userId: req.params.id, active: true }, { web_app: { ...req.body, userTelegramId: Date.now() }, action: req.body.action, status: false }, { new: true });
        console.log(user);

        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }


        const htmlMessage = `<b>Foydalanuvchi Ma'lumotlari:</b>\n<i>Ism:</i> ${user.firstName} ${user.lastName}\n<i>Username:</i> @${user?.fromTelegram?.username}\n<i>Telefon:</i> ${user.phoneNumber}\n`;
        sendMessageToGroup(htmlMessage)

        sendMessageToUser(textGetWithLanguage(user, "after_registr"), user.userId)

        res.status(200).send({ success: true });
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
};



const updateUserBot = async (req, res) => {
    let userId = req.params.id
    console.log(req.params);
    console.log(Object.keys(req.body).length)
    console.log(req.body);
    if (!Object.keys(req.body).length) {
        return res.status(404).send({ message: 'Fields required' });
    }
    try {
        const user = await User.findOneAndUpdate({ userId: userId, active: true }, { ...req.body, web_app: { ...req.body.web_app, userTelegramId: new Date().getTime() } }, { new: true });
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
    console.log(req.params.id);

    try {
        const user = await User.findOneAndUpdate({ userId: req.params.id, active: true }, { active: false, status: false }, { new: true });
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
    updateUseStatus,
    updateUserBot,
    getUsersAdmin
};
