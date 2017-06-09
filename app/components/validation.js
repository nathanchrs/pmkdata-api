'use strict';

var Ajv = require('ajv');
var errors = require('http-errors');

var ajv = new Ajv();

module.exports = {

  /**
   * Creates an Express middleware that validates req.body using the given JSON schema.
   * @param {object} schema - a JSON schema object that will be used for the validator.
   * @returns {function} -  an Express middleware function.
   */
  createValidator: (schema) => {
    var validate = ajv.compile(schema);
    return (req, res, next) => {
      var valid = validate(req.body);
      if (!valid) {
        return next(new errors.UnprocessableEntity('Validation error.', validate.errors));
      }
      return next();
    };
  }

};
