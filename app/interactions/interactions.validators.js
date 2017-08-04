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
      'notes': commonSchemas.varchar(65535)
    },
    'required': ['time', 'notes']
  },

  updateInteraction: {
    'type': 'object',
    'properties': {
      'time': commonSchemas.datetime,
      'notes': commonSchemas.varchar(65535)
    },
    'anyOf': [
      { 'required': ['time'] },
      { 'required': ['notes'] }
    ]
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
