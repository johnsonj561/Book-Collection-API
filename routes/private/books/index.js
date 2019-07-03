const express = require('express')
const uuid = require('uuid');
const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const dynamoClient = require('../../../utils/dynamo').dynamoClient;
const { wrapAsyncRoute, badRequestError } = require('../../../utils/error-handling');
const responses = require('../../../utils/responses');

const SALT_ROUNDS = 10;
const TableName = 'users';


/**
 * addBook - adds new book to user's book collection
 * @param {*} req http request
 * @param {*} res http response
 */
const addBook = async (req, res) => {
  return res.json(responses.successMessage(`Book created`));
}

const getBook = async (req, res) => {
  return res.json(responses.successMessage('Success!'));
}


const bookRouter = express.Router()
bookRouter.get('/', wrapAsyncRoute(getBook));
bookRouter.post('/', wrapAsyncRoute(addBook));

module.exports = bookRouter;
