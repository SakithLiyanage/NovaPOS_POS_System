const ApiError = require('../utils/apiError');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const messages = error.details.map(detail => detail.message).join(', ');
      return next(new ApiError(400, messages));
    }
    
    next();
  };
};

module.exports = validate;
