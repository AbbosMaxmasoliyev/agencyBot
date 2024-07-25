const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token, process.env.JWT_SECRET);
            if (decoded.username) {
                let { username } = decoded
                let admin = await Admin.findOne({ username })
                if (admin.role === "superadmin") {
                    req.permissions = JSON.stringify(["superadmin", "admin"])
                    next();
                }
            } else {
                req.permissions = JSON.stringify(["manager", "admin"])
                res.status(401).json({ message: 'Not authorized' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};



module.exports = { protect };
