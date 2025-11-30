const Joi = require('joi');

const createSaleSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
    })
  ).min(1).required(),
  customerId: Joi.string().allow('', null),
  discount: Joi.number().min(0).max(100).default(0),
  paymentMethod: Joi.string().valid('CASH', 'CARD', 'OTHER').required(),
  amountPaid: Joi.number().min(0),
  notes: Joi.string().allow('', null),
});

module.exports = { createSaleSchema };
