const Customer = require('../models/Customer');
const Sale = require('../models/Sale');
const ApiError = require('../utils/apiError');

const getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: customers,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }

    // Get purchase history
    const purchases = await Sale.find({ customer: customer._id })
      .sort('-createdAt')
      .limit(10)
      .select('invoiceNo grandTotal createdAt paymentMethod');

    res.json({
      success: true,
      data: {
        ...customer.toObject(),
        recentPurchases: purchases,
      },
    });
  } catch (error) {
    next(error);
  }
};

const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }
    res.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      throw new ApiError(404, 'Customer not found');
    }
    res.json({
      success: true,
      message: 'Customer deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
