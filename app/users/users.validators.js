'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');

const schemas = {

  listUsers: {
    'type': 'object',
    'properties': {
      'search': {
        'type': 'string'
      },
      'page': {
        'type': 'number',
        'minimum': 1
      },
      'perPage': {
        'type': 'number',
        'minimum': 1
      },
      'sort': {
        'type': 'string'
      }
    }
  }

};

module.exports = _.mapValues(schemas, validation.createValidator);
