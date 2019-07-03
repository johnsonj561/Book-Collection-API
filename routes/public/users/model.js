const Joi = require('@hapi/joi');

const userSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).strip().required(),
    password: Joi.string().alphanum().min(6).max(30).strip().label('Password').required(),
});

module.exports = {
  validateUser: (user) => Joi.validate(user, userSchema),
};
