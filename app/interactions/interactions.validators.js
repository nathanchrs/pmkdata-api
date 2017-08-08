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
      'notes': commonSchemas.varchar(),
      'tags': commonSchemas.varchar(255)
    },
    'required': ['time', 'notes', 'tags']
  },

  updateInteraction: {
    'type': 'object',
    'properties': {
      'time': commonSchemas.datetime,
      'notes': commonSchemas.varchar(),
      'tags': commonSchemas.varchar(255)
    },
    'anyOf': [
      { 'required': ['time'] },
      { 'required': ['notes'] },
      { 'required': ['tags'] }
    ]
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
