'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

  listEvents: {
    'type': 'object',
    'properties': Object.assign({}, commonSchemas.pagingAndSortingProperties, commonSchemas.searchingProperties)
  },

  createEvent: {
    'type': 'object',
    'properties': {
      'name': commonSchemas.varchar(255),
      'description': commonSchemas.text
    },
    'required': ['name', 'description']
  },

  updateEvent: {
    'type': 'object',
    'properties': {
      'name': commonSchemas.varchar(255),
      'description': commonSchemas.text
    }
  }
};

module.exports = _.mapValues(schemas, validation.createValidator);
