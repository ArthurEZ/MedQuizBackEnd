const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Blacklist = require('../models/Blacklist')

exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token || token === 'null' || token === 'undefined') {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route ( No Token )' });
    }

    try {
        const blacklisted = await Blacklist.findOne({ token });
        // console.log("Is Token Blacklisted ?", blacklisted ? "Yes" : "No");

        if (blacklisted) {
            return res.status(401).json({ success: false, error: 'Token has been invalidated' });
        }

        // console.log("JWT Secret in Middleware : ", process.env.JWT_SECRET);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log("Decoded Token : ", decoded);

        req.user = await User.findById(decoded.id);
        // console.log("User Found : ", req.user);

        if (!req.user) {
            return res.status(401).json({ success: false, error: "User not found" });
        }

        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.stack);
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: "User not authenticated" });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ success: false, error: `User role ${req.user.role} is not authorized to access this route` });
        }

        next();
    };
};
