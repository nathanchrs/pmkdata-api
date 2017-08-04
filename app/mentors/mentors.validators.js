'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

  listMentors: {
    'type': 'object',
    'properties': Object.assign({}, commonSchemas.pagingAndSortingProperties, commonSchemas.searchingProperties)
  },

  createMentor: {
    'type': 'object',
    'properties': {
      'mentor_username': commonSchemas.username,
      'event_id': commonSchemas.number()
    },
    'required': ['mentor_username', 'event_id']
  },

  updateMentor: {
    'type': 'object',
    'properties': {
      'mentor_username': commonSchemas.username,
      'event_id': commonSchemas.number()
    },
    'anyOf': [
      { 'required': ['mentor_username'] },
      { 'required': ['event_id'] }
    ]
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
