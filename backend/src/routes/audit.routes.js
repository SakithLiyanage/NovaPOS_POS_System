const express = require('express');
const router = express.Router();
const { getAuditLogs } = require('../services/auditService');
const { auth, requireRole } = require('../middleware/auth');

router.use(auth);
router.use(requireRole('OWNER'));

router.get('/', async (req, res, next) => {
  try {
    const { action, userId, startDate, endDate, page, limit } = req.query;
    const result = await getAuditLogs(
      { action, userId, startDate, endDate },
      { page: parseInt(page) || 1, limit: parseInt(limit) || 50 }
    );
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
