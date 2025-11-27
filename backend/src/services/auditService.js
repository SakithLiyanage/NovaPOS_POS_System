const AuditLog = require('../models/AuditLog');

const logAction = async (req, action, targetType = null, targetId = null, details = null) => {
  try {
    await AuditLog.create({
      action,
      userId: req.user?._id,
      targetType,
      targetId,
      details,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
  } catch (error) {
    console.error('Audit log error:', error);
  }
};

const getAuditLogs = async (filters = {}, pagination = {}) => {
  const { userId, action, startDate, endDate } = filters;
  const { page = 1, limit = 50 } = pagination;

  const query = {};

  if (userId) query.userId = userId;
  if (action) query.action = action;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const total = await AuditLog.countDocuments(query);
  const logs = await AuditLog.find(query)
    .populate('userId', 'name email')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    data: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

module.exports = { logAction, getAuditLogs };
