'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

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
