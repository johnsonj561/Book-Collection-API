const Joi = require('@hapi/joi');

const bookSchema = Joi.object().keys({
    title: Joi.string().min(1).max(100).required(),
    author: Joi.string().min(1).max(100).required(),
    dateRead: Joi.string().min(1).max(20).required(),
    description: Joi.string().min(1).max(500),
});

module.exports = {
  validateBook: (book) => Joi.validate(book, bookSchema),
};
