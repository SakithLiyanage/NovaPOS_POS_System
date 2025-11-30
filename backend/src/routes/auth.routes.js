const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, login);
router.get('/me', auth, getMe);

module.exports = router;
