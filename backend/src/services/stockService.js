const mongoose = require('mongoose');
const Product = require('../models/Product');
const StockEntry = require('../models/StockEntry');
const ApiError = require('../utils/apiError');

const adjustStock = async (productId, quantityChange, reason, userId, notes = '', session = null) => {
  const options = session ? { session } : {};
  
  const product = await Product.findById(productId).session(session);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  const previousStock = product.currentStock;
  const newStock = previousStock + quantityChange;

  if (newStock < 0) {
    throw new ApiError(400, `Insufficient stock. Available: ${previousStock}`);
  }

  product.currentStock = newStock;
  await product.save(options);

  const stockEntry = await StockEntry.create([{
    product: productId,
    quantityChange,
    previousStock,
    newStock,
    reason,
    notes,
    createdBy: userId,
  }], options);

  return { product, stockEntry: stockEntry[0] };
};

const bulkAdjustStock = async (adjustments, userId, session = null) => {
  const results = [];

  for (const adj of adjustments) {
    const result = await adjustStock(
      adj.productId,
      adj.quantityChange,
      adj.reason,
      userId,
      adj.notes,
      session
    );
    results.push(result);
  }

  return results;
};

const getStockValue = async () => {
  const result = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        totalCostValue: { $sum: { $multiply: ['$currentStock', '$costPrice'] } },
        totalSaleValue: { $sum: { $multiply: ['$currentStock', '$salePrice'] } },
        totalItems: { $sum: '$currentStock' },
      },
    },
  ]);

  return result[0] || { totalCostValue: 0, totalSaleValue: 0, totalItems: 0 };
};

module.exports = { adjustStock, bulkAdjustStock, getStockValue };
