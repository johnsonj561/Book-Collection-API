const express = require('express');
const jwt = require('jsonwebtoken');
const { unauthorizedError, wrapAsyncRoute } = require('../../utils/error-handling');
const router = express.Router();


/*
 * Token Validation Middleware
 * Valid token is required to access the proceeding routes
 */
const decodeToken = async (req, res, next) => {
  const bearer = req.headers['authorization'] || req.headers['Authorization'] || '';
  const [,token] = bearer.split('Bearer');
  const decodedToken = await jwt.verify(token, process.env.MY_BOOKS_API_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      throw unauthorizedError('Invalid token');
    }
    req.decoded = decoded;
    next();
  });
};

router.use(wrapAsyncRoute(decodeToken));
module.exports = router;
