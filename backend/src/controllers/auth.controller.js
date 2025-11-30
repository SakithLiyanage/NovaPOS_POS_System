const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const ApiError = require('../utils/apiError');
const { logAction } = require('../services/auditService');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    if (!user.isActive) {
      throw new ApiError(401, 'Account is deactivated');
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    await logAction(req, 'USER_LOGIN', 'User', user._id);

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'Email already registered');
    }

    // Only owners can create other users
    if (req.user && req.user.role !== 'OWNER' && role !== 'CASHIER') {
      throw new ApiError(403, 'Only owners can assign manager or owner roles');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'CASHIER',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, getMe, register };
