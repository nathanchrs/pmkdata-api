'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

  listInteractions: {
    'type': 'object',
    'properties': Object.assign({}, commonSchemas.pagingAndSortingProperties, commonSchemas.searchingProperties)
  },

  createInteraction: {
    'type': 'object',
    'properties': {
      'time': commonSchemas.datetime,
      'title': commonSchemas.varchar(255),
      'notes': commonSchemas.text,
      'tags': commonSchemas.varchar(255)
    },
    'required': ['time', 'title', 'notes', 'tags']
  },

  updateInteraction: {
    'type': 'object',
    'properties': {
      'time': commonSchemas.datetime,
      'title': commonSchemas.varchar(255),
      'notes': commonSchemas.text,
      'tags': commonSchemas.varchar(255)
    }
  },

  addInteractionMentor: {
    'type': 'object',
    'properties': {
      'user_username': commonSchemas.varchar(255)
    },
    'required': ['user_username']
  },

  addInteractionParticipant: {
    'type': 'object',
    'properties': {
      'student_id': commonSchemas.auto_id
    },
    'required': ['student_id']
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
