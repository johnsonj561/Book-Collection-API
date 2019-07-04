const createError = require('http-errors')

const errorOptions = { safeError: true };
const errorWithCode = (code) => (message) => createError(code, message, errorOptions);

/**
 * wrapAsyncRoute appends Promise.catch to wrapped function call
 * to enable middleware error handling
 * @param {function} fn - async route handler to be wrapped
 */
const wrapAsyncRoute = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
}


module.exports = {
  wrapAsyncRoute,
  httpError: createError,
  badRequestError: errorWithCode(400),
  unauthorizedError: errorWithCode(401),
  forbiddenError: errorWithCode(403),
  notFoundError: errorWithCode(404),
  internalServerError: errorWithCode(500),
};
