const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        console.log(req.headers);
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.decode(token, process.env.JWT_SECRET);
            if (decoded.username) {
                
                let { username } = decoded
                let admin = await Admin.findOne({ username })
                console.log(admin, " =>admin");
                if (admin.role === "superadmin") {
                    next();
                }
            } else {
                req.permissions = JSON.stringify(["manager", "admin"])
                res.status(401).json({ message: 'Not authorized' });
            }
        } catch (error) {
            console.log(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};



module.exports = { protect };
