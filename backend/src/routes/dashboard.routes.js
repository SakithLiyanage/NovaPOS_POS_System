const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboard.controller');
const { auth } = require('../middleware/auth');

router.use(auth);

router.get('/stats', getDashboardStats);

module.exports = router;
