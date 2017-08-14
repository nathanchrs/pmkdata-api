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
      'mentor_id': commonSchemas.auto_id,
      'mentee_id': commonSchemas.auto_id,
      'notes': commonSchemas.text
    },
    'required': ['mentor_id', 'mentee_id', 'notes']
  },

  updateMentee: {
    'type': 'object',
    'properties': {
      'mentor_id': commonSchemas.auto_id,
      'mentee_id': commonSchemas.auto_id,
      'notes': commonSchemas.text
    },
    'anyOf': [
      { 'required': ['mentor_id'] },
      { 'required': ['mentee_id'] },
      { 'required': ['notes'] }
    ]
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
