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
      'interaction_id': commonSchemas.number(),
      'mentee_id': commonSchemas.number()
    },
    'required': ['interaction_id', 'mentee_id']
  },

  updateInteractionParticipant: {
    'type': 'object',
    'properties': {
      'interaction_id': commonSchemas.number(),
      'mentee_id': commonSchemas.number()
    },
    'anyOf': [
      { 'required': ['interaction_id'] },
      { 'required': ['mentee_id'] }
    ]
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
