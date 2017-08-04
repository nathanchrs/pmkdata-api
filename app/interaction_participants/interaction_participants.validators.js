'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

  listInteractionParticipants: {
    'type': 'object',
    'properties': Object.assign({}, commonSchemas.pagingAndSortingProperties, commonSchemas.searchingProperties)
  },

  createInteractionParticipant: {
    'type': 'object',
    'properties': {
      'mentor_id': commonSchemas.number(),
      'mentee_id': commonSchemas.number()
    },
    'required': ['mentor_id', 'mentee_id']
  },

  updateInteractionParticipant: {
    'type': 'object',
    'properties': {
      'mentor_id': commonSchemas.number(),
      'mentee_id': commonSchemas.number()
    },
    'anyOf': [
      { 'required': ['mentor_id'] },
      { 'required': ['mentee_id'] }
    ]
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
