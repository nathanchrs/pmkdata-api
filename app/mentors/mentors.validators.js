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
      'event_id': commonSchemas.number(),
      'status': commonSchemas.userStatus
    },
    'required': ['mentor_username', 'event_id', 'status']
  },

  updateMentor: {
    'type': 'object',
    'properties': {
      'mentor_username': commonSchemas.username,
      'event_id': commonSchemas.number(),
      'status': commonSchemas.userStatus
    },
    'anyOf': [
      { 'required': ['mentor_username'] },
      { 'required': ['event_id'] },
      { 'required': ['status'] }
    ]
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
