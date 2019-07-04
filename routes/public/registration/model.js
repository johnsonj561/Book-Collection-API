const Joi = require('@hapi/joi');

const registrationSchema = Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).min(6).required(),
    password2: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).min(6).required(),
});

module.exports = {
  validateRegistration: (user) => Joi.validate(user, registrationSchema),
};
