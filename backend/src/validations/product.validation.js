const Joi = require('joi');

const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(200).required(),
  sku: Joi.string().min(1).max(50).required(),
  barcode: Joi.string().allow('', null),
  categoryId: Joi.string().allow('', null),
  brandId: Joi.string().allow('', null),
  costPrice: Joi.number().min(0).default(0),
  salePrice: Joi.number().min(0).required(),
  taxRate: Joi.number().min(0).max(100).default(0),
  currentStock: Joi.number().min(0).default(0),
  lowStockThreshold: Joi.number().min(0).default(10),
  imageUrl: Joi.string().allow('', null),
  isActive: Joi.boolean().default(true),
});

const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(200),
  sku: Joi.string().min(1).max(50),
  barcode: Joi.string().allow('', null),
  categoryId: Joi.string().allow('', null),
  brandId: Joi.string().allow('', null),
  costPrice: Joi.number().min(0),
  salePrice: Joi.number().min(0),
  taxRate: Joi.number().min(0).max(100),
  lowStockThreshold: Joi.number().min(0),
  imageUrl: Joi.string().allow('', null),
  isActive: Joi.boolean(),
});

module.exports = { createProductSchema, updateProductSchema };
