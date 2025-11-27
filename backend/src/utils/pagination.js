const paginate = (query, { page = 1, limit = 20, sort = '-createdAt' }) => {
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  return {
    query: query.sort(sort).skip(skip).limit(parseInt(limit)),
    page: parseInt(page),
    limit: parseInt(limit),
  };
};

const getPaginationInfo = (total, page, limit) => {
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    hasNextPage: parseInt(page) < Math.ceil(total / parseInt(limit)),
    hasPrevPage: parseInt(page) > 1,
  };
};

module.exports = { paginate, getPaginationInfo };
