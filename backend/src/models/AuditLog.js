const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'USER_LOGIN',
      'USER_LOGOUT',
      'USER_CREATED',
      'USER_UPDATED',
      'USER_DELETED',
      'PRODUCT_CREATED',
      'PRODUCT_UPDATED',
      'PRODUCT_DELETED',
      'STOCK_ADJUSTED',
      'SALE_CREATED',
      'SALE_REFUNDED',
      'SETTINGS_UPDATED',
    ],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  targetType: {
    type: String,
    enum: ['User', 'Product', 'Sale', 'Customer', 'Settings', 'StockEntry'],
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
});

auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
