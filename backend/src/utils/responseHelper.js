const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
  });
};

const sendPaginated = (res, data, pagination, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    pagination,
  });
};

const sendError = (res, message, statusCode = 400) => {
  res.status(statusCode).json({
    success: false,
    message,
  });
};

const sendCreated = (res, data) => sendSuccess(res, data, 201);

const sendNoContent = (res) => res.status(204).send();

module.exports = {
  sendSuccess,
  sendPaginated,
  sendError,
  sendCreated,
  sendNoContent,
};
