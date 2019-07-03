const express = require('express')
const uuid = require('uuid');
const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const dynamoClient = require('../../../utils/dynamo').dynamoClient;
const { wrapAsyncRoute, badRequestError } = require('../../../utils/error-handling');
const responses = require('../../../utils/responses');
const { validateUser } = require('./model');

const SALT_ROUNDS = 10;
const TableName = 'users';


/**
 * createUser - creates new user in users database
 * @param {*} req http request
 * @param {*} res http response
 */
const createUser = async (req, res) => {
  const { error } = await validateUser(req.body);
  console.log(error);
  const { username, password } = req.body;
  const Key = { username };
  // check if username is available
  const existingUser = await dynamoClient.get({ TableName, Key }).promise();
  if (existingUser.Item) {
    throw badRequestError(`Username ${username} already exists`);
  }
  // hash password and save new user
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  const createDate = new Date().toUTCString();
  const Item = { username, hash, createDate }
  await dynamoClient.put({ TableName, Item }).promise();
  return res.json(responses.successMessage(`User ${username} created`));
}


const userRouter = express.Router()
userRouter.post('/', wrapAsyncRoute(createUser));

module.exports = userRouter;
