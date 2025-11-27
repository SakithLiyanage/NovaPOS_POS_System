const Sale = require('../models/Sale');
const Product = require('../models/Product');

const getSalesReport = async (startDate, endDate, groupBy = 'day') => {
  let dateFormat;
  switch (groupBy) {
    case 'hour':
      dateFormat = '%Y-%m-%d %H:00';
      break;
    case 'month':
      dateFormat = '%Y-%m';
      break;
    case 'year':
      dateFormat = '%Y';
      break;
    default:
      dateFormat = '%Y-%m-%d';
  }

  return Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: 'COMPLETED',
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
        revenue: { $sum: '$grandTotal' },
        cost: { $sum: '$subtotal' },
        tax: { $sum: '$taxAmount' },
        discount: { $sum: '$discountAmount' },
        count: { $sum: 1 },
        avgOrderValue: { $avg: '$grandTotal' },
      },
    },
    { $sort: { _id: 1 } },
  ]);
};

const getProductPerformance = async (startDate, endDate, limit = 20) => {
  return Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: 'COMPLETED',
      },
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        name: { $first: '$items.name' },
        quantitySold: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.lineTotal' },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: limit },
  ]);
};

const getCashierPerformance = async (startDate, endDate) => {
  return Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: 'COMPLETED',
      },
    },
    {
      $group: {
        _id: '$cashier',
        salesCount: { $sum: 1 },
        revenue: { $sum: '$grandTotal' },
        avgOrderValue: { $avg: '$grandTotal' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'cashierInfo',
      },
    },
    { $unwind: '$cashierInfo' },
    {
      $project: {
        _id: 1,
        name: '$cashierInfo.name',
        salesCount: 1,
        revenue: 1,
        avgOrderValue: 1,
      },
    },
    { $sort: { revenue: -1 } },
  ]);
};

const getPaymentMethodBreakdown = async (startDate, endDate) => {
  return Sale.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        status: 'COMPLETED',
      },
    },
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        total: { $sum: '$grandTotal' },
      },
    },
  ]);
};

module.exports = {
  getSalesReport,
  getProductPerformance,
  getCashierPerformance,
  getPaymentMethodBreakdown,
};
