const User = require('../models/User');
const Blacklist = require('../models/Blacklist');


const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({ success: true, token });
};

/**
 * @desc Register user
 * @route POST /api/v1/auth/register
 * @access Public
 */
exports.register = async (req, res, next) => {
    try {
        const { name, year, email, password, role } = req.body;

        const user = await User.create({
            name,
            year,
            email,
            password,
            role
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error(error.stack);
        res.status(400).json({ success: false });
    }
};

/**
 * @desc Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error(error.stack);
        return res.status(401).json({ success: false, msg: 'Cannot convert email or password to string' });
    }
};

/**
 * @desc Logout user
 * @route GET /api/v1/auth/logout
 * @access Private
 */
exports.logout = async (req, res, next) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided'
            });
        }

        const token = req.headers.authorization.split(' ')[1];

        const existingBlacklist = await Blacklist.findOne({ token });
        if (existingBlacklist) {
            return res.status(400).json({
                success: false,
                error: 'Token already invalidated'
            });
        }

        await Blacklist.create({ token });

        res.cookie('token', 'none', {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });

        res.status(200).json({
            success: true,
            message: 'User logged out successfully'
        });
    } catch (error) {
        console.error(error.stack);
        res.status(500).json({
            success: false,
            error: 'Error during logout'
        });
    }
};

/**
 * @desc Get current Logged in user
 * @route POST /api/v1/auth/me
 * @access Private
 */
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error(error.stack);
        res.status(400).json({ success: false });
    }
};

exports.updateUser = async (req, res) => {
    try {
      if (req.params.id !== req.user.id && req.user.role === "user" ) {
        return res.status(401).json({
          success: false,
          message: "User is not authorized to update this user.",
        });
      }
  
      const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!user) {
        return res.status(400).json({ success: false });
      }
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "please check your tel.",
      });
    }
  };
  