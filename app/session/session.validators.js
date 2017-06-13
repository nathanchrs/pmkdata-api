'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');

const schemas = {

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
