const Joi = require('joi');

const saleItemSchema = Joi.object({
  productId: Joi.string().required(),
  name: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  unitPrice: Joi.number().min(0).required(),
  taxRate: Joi.number().min(0).max(100).default(0),
});

const createSaleSchema = Joi.object({
  items: Joi.array().items(saleItemSchema).min(1).required(),
  customerId: Joi.string().allow(null, ''),
  discount: Joi.number().min(0).max(100).default(0),
  paymentMethod: Joi.string().valid('CASH', 'CARD', 'OTHER').required(),
  notes: Joi.string().allow('', null),
});

module.exports = { createSaleSchema };
