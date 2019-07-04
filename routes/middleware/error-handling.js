const express = require('express');
const _ = require('lodash');
const { badRequestError } = require('../../utils/error-handling');
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
  const { safeError, statusCode, status = 'ServerError', message } = error;
  if (safeError && statusCode) {
    return res.status(statusCode).json({ success: false, status, message });
  }
  return res.status(statusCode).json({
    success: false,
    status,
    message: 'Unexpected error processing request'
  });
}

module.exports = {
  joiErrorMiddleware,
  errorMiddleware,
};
