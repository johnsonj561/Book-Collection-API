const express = require('express')
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const dynamoClient = require('../../../utils/dynamo').dynamoClient;
const { wrapAsyncRoute, badRequestError } = require('../../../utils/error-handling');
const responses = require('../../../utils/responses');
const { validateRegistration } = require('./model');

const SALT_ROUNDS = 10;
const TableName = 'users';


/**
 * registerUser - creates new user in users database
 * @param {*} req http request
 * @param {*} res http response
 */
const registerUser = async (req, res) => {
  await validateRegistration(req.body);
  const { email, password, password2 } = req.body;
  if (password !== password2) {
    throw badRequestError('Passwords do not match');
  }
  const Key = { email };
  // check if username is available
  const existingUser = await dynamoClient.get({ TableName, Key }).promise();
  if (existingUser.Item) {
    throw badRequestError(`An account for ${email} already exists`);
  }
  // hash password and save new user
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const createDate = new Date().toUTCString();
  const userId = uuid.v4();
  const Item = { email, userId, hash, createDate };
  await dynamoClient.put({ TableName, Item }).promise();
  return res.json(responses.successMessage(`Account created for ${email}`));
}


const registrationRouter = express.Router()
registrationRouter.post('/', wrapAsyncRoute(registerUser));

module.exports = registrationRouter;
