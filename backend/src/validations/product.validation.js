const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().required().max(200),
  sku: Joi.string().required().max(50),
  barcode: Joi.string().allow('', null),
  category: Joi.string().allow('', null),
  brand: Joi.string().allow('', null),
  costPrice: Joi.number().min(0).default(0),
  salePrice: Joi.number().required().min(0),
  taxRate: Joi.number().min(0).max(100).default(0),
  currentStock: Joi.number().integer().min(0).default(0),
  lowStockThreshold: Joi.number().integer().min(0).default(10),
  imageUrl: Joi.string().uri().allow('', null),
  isActive: Joi.boolean().default(true),
});

const updateProductSchema = Joi.object({
  name: Joi.string().max(200),
  sku: Joi.string().max(50),
  barcode: Joi.string().allow('', null),
  category: Joi.string().allow('', null),
  brand: Joi.string().allow('', null),
  costPrice: Joi.number().min(0),
  salePrice: Joi.number().min(0),
  taxRate: Joi.number().min(0).max(100),
  currentStock: Joi.number().integer().min(0),
  lowStockThreshold: Joi.number().integer().min(0),
  imageUrl: Joi.string().uri().allow('', null),
  isActive: Joi.boolean(),
});

module.exports = { createProductSchema, updateProductSchema };
