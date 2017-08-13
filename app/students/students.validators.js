'use strict';

const _ = require('lodash');
const validation = require('../components/validation.js');
const commonSchemas = require('../common/schemas.js');

const schemas = {

  listStudents: {
    'type': 'object',
    'properties': Object.assign({}, commonSchemas.pagingAndSortingProperties, commonSchemas.searchingProperties)
  },

  createStudent: {
    'type': 'object',
    'properties': {
      'tpb_nim': commonSchemas.nim,
      'nim': commonSchemas.nim,
      'year': commonSchemas.year,
      'department': commonSchemas.varchar(255),
      'name': commonSchemas.varchar(255),
      'gender': commonSchemas.gender,
      'birth_date': commonSchemas.date,
      'phone': commonSchemas.phone,
      'parent_phone': commonSchemas.phone,
      'line': commonSchemas.line,
      'current_address': commonSchemas.text,
      'hometown_address': commonSchemas.text,
      'high_school': commonSchemas.varchar(255),
      'church': commonSchemas.varchar(255)
    },
    'required': ['year', 'department', 'name', 'gender', 'birth_date', 'phone', 'parent_phone', 'line', 'current_address', 'hometown_address', 'high_school', 'church']
  },

  updateStudent: {
    'type': 'object',
    'properties': {
      'tpb_nim': commonSchemas.nim,
      'nim': commonSchemas.nim,
      'year': commonSchemas.year,
      'department': commonSchemas.varchar(255),
      'name': commonSchemas.varchar(255),
      'gender': commonSchemas.gender,
      'birth_date': commonSchemas.date,
      'phone': commonSchemas.phone,
      'parent_phone': commonSchemas.phone,
      'line': commonSchemas.line,
      'current_address': commonSchemas.text,
      'hometown_address': commonSchemas.text,
      'high_school': commonSchemas.varchar(255),
      'church': commonSchemas.varchar(255)
    }
  }

};

module.exports = _.mapValues(schemas, validation.createValidator);
