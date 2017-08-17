'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

  addMentee: {
    'type': 'object',
    'properties': {
      'user_id': commonSchemas.auto_id,
      'student_id': commonSchemas.auto_id,
      'notes': commonSchemas.varchar(255)
    },
    'required': ['user_id', 'student_id']
  },
};

module.exports = _.mapValues(schemas, validation.createValidator);
