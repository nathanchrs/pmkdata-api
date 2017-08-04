'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

  listMentees: {
    'type': 'object',
    'properties': Object.assign({}, commonSchemas.pagingAndSortingProperties, commonSchemas.searchingProperties)
  },

  createMentee: {
    'type': 'object',
    'properties': {
      'mentor_id': commonSchemas.number(),
      'mentee_id': commonSchemas.number(),
      'notes': commonSchemas.varchar(65535)
    },
    'required': ['mentor_id', 'mentee_id', 'notes']
  },

  updateMentee: {
    'type': 'object',
    'properties': {
      'mentor_id': commonSchemas.number(),
      'mentee_id': commonSchemas.number(),
      'notes': commonSchemas.varchar(65535)
    },
    'anyOf': [
      { 'required': ['mentor_id'] },
      { 'required': ['mentee_id'] },
      { 'required': ['notes'] }
    ]
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
