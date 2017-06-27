'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

  listUsers: {
    'type': 'object',
    'properties': Object.assign(commonSchemas.pagingAndSortingProperties, {
      'search': {
        'type': 'string'
      }
    })
  },

  createUser: {
    'type': 'object',
    'properties': {
      'username': commonSchemas.username,
      'password': commonSchemas.password,
      'nim': commonSchemas.nim,
      'email': commonSchemas.email
    },
    'required': ['username', 'email', 'password']
  },

  updateUser: {
    'type': 'object',
    'properties': {
      'nim': commonSchemas.nim,
      'email': commonSchemas.email
    },
    'anyOf': [
      {'required': ['nim']},
      {'required': ['email']}
    ]
  },

  updatePassword: {
    'type': 'object',
    'properties': {
      'oldPassword': commonSchemas.password,
      'newPassword': commonSchemas.password
    },
    'required': ['oldPassword', 'newPassword']
  }

};

module.exports = _.mapValues(schemas, validation.createValidator);
