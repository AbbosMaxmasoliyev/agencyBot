const Admin = require('../models/admin');
const { generateToken, decodeToken } = require('../utils/generateToken');
const bcrypt = require("bcrypt")
// Sign-up (Ro'yxatdan o'tish)
const signUp = async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(req.body);
    try {
        const adminExists = await Admin.findOne({ username });
        console.log(adminExists);
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const admin = await Admin.create({ username, password });

        res.status(201).send({
            _id: admin._id,
            username: admin.username,
            token: generateToken(admin._id)
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

// Sign-in (Tizimga kirish)
const signIn = async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(req.body);
    try {
        const admin = await Admin.findOne({ username });
        let checkPassword = await bcrypt.compare(password, admin.password)
        console.log(checkPassword);
        if (admin && checkPassword) {
            if (admin.role == "superadmin") {
                res.send({
                    username: admin.username,
                    token: generateToken(admin._id,),
                    permissions: ["admin", "superadmin"]
                });
            } else {
                res.send({
                    username: admin.username,
                    token: generateToken(admin._id,),
                    permissions: ["admin", "manager"]
                });
            }
        } else {
            console.log(admin);
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// CRUD operatsiyalari (Create, Read, Update, Delete)
// Ma'lumotlarni yaratish
const createManager = async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(req.body);
    try {
        const adminExists = await Admin.findOne({ username });
        console.log(adminExists);
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const admin = await Admin.create({ username, password, role: "manager" });

        res.status(201).send({
            username: admin.username,
            password
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

// Ma'lumotlarni olish
const getData = async (req, res) => {
    // Ma'lumot olish kodi
};

// Ma'lumotni yangilash
const updateData = async (req, res) => {
    // Ma'lumot yangilash kodi
};

// Ma'lumotni o'chirish
const deleteData = async (req, res) => {
    // Ma'lumot o'chirish kodi
};

module.exports = { signUp, signIn, createManager, getData, updateData, deleteData };
