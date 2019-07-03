const Joi = require('@hapi/joi');

const bookSchema = Joi.object().keys({
    title: Joi.string().alphanum().min(1).max(100).strip().required(),
    author: Joi.string().alphanum().min(1).max(100).strip().required(),
});

module.exports = {
  validateBook: (book) => Joi.validate(book, bookSchema),
};
