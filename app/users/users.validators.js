'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

  listUsers: {
    'type': 'object',
    'properties': Object.assign({}, commonSchemas.pagingAndSortingProperties, commonSchemas.searchingProperties)
  },

  createUser: {
    'type': 'object',
    'properties': {
      'username': commonSchemas.username,
      'password': commonSchemas.password,
      'status': commonSchemas.userStatus,
      'nim': commonSchemas.nim,
      'email': commonSchemas.email
    },
    'required': ['username', 'email', 'password']
  },

  updateUser: {
    'type': 'object',
    'properties': {
      'nim': commonSchemas.nim,
      'email': commonSchemas.email,
      'status': commonSchemas.userStatus
    }
  },

  updateUserPassword: {
    'type': 'object',
    'properties': {
      'oldPassword': commonSchemas.password,
      'newPassword': commonSchemas.password
    },
    'required': ['newPassword']
  },

  addUserRole: {
    'type': 'object',
    'properties': {
      'role': commonSchemas.role
    },
    'required': ['role']
  }

};

module.exports = _.mapValues(schemas, validation.createValidator);
