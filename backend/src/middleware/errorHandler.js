const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: 'Validation Error',
      errors: messages,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid ID format',
    });
  }

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.details.map(d => d.message),
    });
  }

  // Custom API error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Default server error
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
};

module.exports = errorHandler;
