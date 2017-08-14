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
      'interaction_id': commonSchemas.auto_id,
      'mentee_id': commonSchemas.auto_id
    },
    'required': ['interaction_id', 'mentee_id']
  },

  updateInteractionParticipant: {
    'type': 'object',
    'properties': {
      'interaction_id': commonSchemas.auto_id,
      'mentee_id': commonSchemas.auto_id
    },
    'anyOf': [
      { 'required': ['interaction_id'] },
      { 'required': ['mentee_id'] }
    ]
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
