'use strict';

/**
 * @module app/components/validation
 */

const Ajv = require('ajv');
const errors = require('http-errors');

const ajv = new Ajv({
  coerceTypes: true
});

module.exports = {

  /**
   * Creates an [Express](https://expressjs.com/) middleware that validates req.body using the given JSON schema.
   * @param {object} schema - a JSON schema object that will be used for the validator.
   * @returns {function} -  an Express middleware function.
   */
  createValidator: (schema) => {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
      let valid = validate(req.body);
      if (!valid) {
        return next(new errors.UnprocessableEntity('Validation error.', validate.errors));
      }
      return next();
    };
  }

};
