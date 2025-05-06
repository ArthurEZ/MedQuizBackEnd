const express = require('express');
const { register, login, logout, getMe, updateUser } = require('../controllers/auth');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put("/updateUser/:id", protect, authorize("S-admin","admin", "user"), updateUser);

module.exports = router;