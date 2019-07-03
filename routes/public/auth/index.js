const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dynamoClient = require('../../../utils/dynamo').dynamoClient;
const { wrapAsyncRoute, badRequestError, unauthorizedError } = require('../../../utils/error-handling');
const responses = require('../../../utils/responses');

const TOKEN_EXPIRATION = '30m';
const TableName = 'users';


/**
 * authenticareUser - authenticates username with password
 * Responds with signed JWT if authentication succeeds
 * @param {*} req http request
 * @param {*} res http response
 */
const authenticateUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    throw badRequestError('Username and password are required.');
  }
  const Key = { username };
  const { Item: user } = await dynamoClient.get({ TableName, Key }).promise();
  if (!user) {
    throw unauthorizedError('Invalid username or password.')
  }
  const validPassword = await bcrypt.compare(password, user.hash);
  if (!validPassword) {
    throw unauthorizedError('Invalid username or password');
  }
  // success, generate user token
  const tokenData = { username };
  const tokenOptions = { expiresIn: TOKEN_EXPIRATION };
  const token = await jwt.sign(tokenData, process.env.MY_BOOKS_API_TOKEN_SECRET, tokenOptions);
  return res.json(responses.successData({ token }));
};

router.post('/', wrapAsyncRoute(authenticateUser));

module.exports = router
