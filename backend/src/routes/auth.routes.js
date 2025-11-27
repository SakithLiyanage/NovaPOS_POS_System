const express = require('express');
const router = express.Router();
const { login, getMe, register } = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { loginSchema, registerSchema } = require('../validations/auth.validation');

router.post('/login', validate(loginSchema), login);
router.get('/me', auth, getMe);
router.post('/register', auth, validate(registerSchema), register);

module.exports = router;
