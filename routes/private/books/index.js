const express = require('express')
const uuid = require('uuid');
const { dynamoClient } = require('../../../utils/dynamo');
const { wrapAsyncRoute, notFoundError } = require('../../../utils/error-handling');
const responses = require('../../../utils/responses');
const { validateBook } = require('./model');

const TableName = 'books';

/**
 * addBook - adds new book to user's book collection
 * @param {*} req http request
 * @param {*} res http response
 */
const addBook = async (req, res) => {
  await validateBook(req.body);
  const { userId } = req.decoded;
  const createDate = new Date().toUTCString();
  const bookId = uuid.v4();
  const Item = { userId, bookId, ...req.body, createDate };
  const params = { TableName, Item };
  await dynamoClient.put(params).promise();
  return res.json(responses.successData(Item));
}

/**
 * getBook - returns book with bookId from user's collection
 * @param {*} req http request
 * @param {*} res http response
 */
const getBook = async (req, res) => {
  const { bookId } = req.params;
  const { userId } = req.decoded;
  const Key = { userId, bookId };
  const params = { TableName, Key };
  const { Item: book } = await dynamoClient.get(params).promise();
  if (!book) {
    throw notFoundError('Book not found');
  }
  return res.json(responses.successData(book));
}


const bookRouter = express.Router()
bookRouter.get('/:bookId', wrapAsyncRoute(getBook));
bookRouter.post('/', wrapAsyncRoute(addBook));

module.exports = bookRouter;
