const express = require('express');
const router = express.Router();

const joiErrorMiddleware = (error, req, res, next) => {
  if (error.isJoi) {
    const message = _.get(error, 'details[0].message', 'Validation Error')
      .replace(/"|\\/g, '');
    next(badRequestError(message));
  }
  next(error);
}

const errorMiddleware = (error, req, res, next) => {
  const { statusCode = 500, status = 'ServerError', message } = error;
  return res.status(statusCode).json({ success: false, status, message });
}

module.exports = {
  joiErrorMiddleware,
  errorMiddleware,
};
