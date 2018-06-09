'use strict';

const _ = require('lodash');
const validation = require('../common/validation');
const commonSchemas = require('../common/schemas');

const schemas = {
  createRolePrivilege: {
    'type': 'object',
    'properties': {
      'privilege': commonSchemas.varchar(255)
    },
    'required': ['privilege']
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
