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
            token: generateToken({ username: admin.username })
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

// Sign-in (Tizimga kirish)
const signIn = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    try {
        console.log(username, password);
        const admin = await Admin.findOne({ username });
        console.log(admin.password);

        let checkPassword = await admin.matchPassword(password)

        console.log(checkPassword);
        

        if (admin && checkPassword) {
            if (admin.role == "superadmin") {
                res.send({
                    username: admin.username,
                    token: generateToken({ username: admin.username }),
                    permissions: ["admin", "superadmin"]
                });
            } else {
                res.send({
                    username: admin.username,
                    token: generateToken({ username: admin.username }),
                    permissions: ["admin", "manager"]
                });
            }
        } else {
            console.log(admin);
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.log(error);

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

        res.status(200).send({
            username: admin.username,
            password
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
}

// Ma'lumotlarni olish
const getManagers = async (req, res) => {
    try {
        let managers = await Admin.find({ role: "manager" })
        res.status(200).send(managers)
    } catch (error) {
        res.status(400).send({ success: false })

    }
};

// Ma'lumotni yangilash
const updateManager = async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    try {
        // Mavjud managerni qidiring
        const manager = await Admin.findById(id);

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        // Yangi username boshqa manager tomonidan ishlatilmayotganini tekshiring
        const managerWithNewUsername = await Admin.findOne({ username });
        if (managerWithNewUsername && managerWithNewUsername.id !== id) {
            return res.status(400).json({ message: 'Username already taken by another manager' });
        }

        // Manager ma'lumotlarini yangilang
        const salt = await bcrypt.genSalt(10);
        let nextPassword = await bcrypt.hash(password, salt)
        let updatedManager = await Admin.findByIdAndUpdate(id, { username, password: nextPassword })

        if (updatedManager._id) {
            res.status(200).send({
                username: updatedManager.username,
                message: 'Manager updated successfully'
            });
        } else {
            res.status(400).send({
                message: 'Manager updated failed'
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

// Ma'lumotni o'chirish
const deleteManager = async (req, res) => {
    const { id } = req.params;

    try {
        // Mavjud managerni qidiring va o'chiring
        const manager = await Admin.findByIdAndDelete(id);

        if (!manager) {
            return res.status(404).json({ message: 'Manager not found' });
        }

        res.status(200).send({
            message: 'Manager deleted successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};
module.exports = { signUp, signIn, createManager, getManagers, updateManager, deleteManager };
