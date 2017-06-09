'use strict';

var _ = require('lodash');
var validation = require('../components/validation.js');

var schemas = {

  createSession: {
    'type': 'object',
    'properties': {
      'username': {
        'type': 'string'
      },
      'password': {
        'type': 'string'
      }
    },
    'required': ['username', 'password']
  }

};

module.exports = _.mapValues(schemas, validation.createValidator);
