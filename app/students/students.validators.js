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
      'year': commonSchemas.number(2000, 2100),
      'department': commonSchemas.varchar(255),
      'name': commonSchemas.varchar(255),
      'gender': commonSchemas.varchar(16),
      'birth_date': commonSchemas.date,
      'phone': commonSchemas.varchar(16),
      'line': commonSchemas.varchar(32),
      'high_school': commonSchemas.varchar(255),
      'church': commonSchemas.varchar(255)
    },
    'required': ['year', 'department', 'name', 'gender', 'birth_date', 'phone', 'line', 'high_school', 'church']
  },

  updateStudent: {
    'type': 'object',
    'properties': {
      'tpb_nim': commonSchemas.nim,
      'nim': commonSchemas.nim,
      'year': commonSchemas.number(2000, 2100),
      'department': commonSchemas.varchar(255),
      'name': commonSchemas.varchar(255),
      'gender': commonSchemas.varchar(16),
      'birth_date': commonSchemas.date,
      'phone': commonSchemas.varchar(16),
      'line': commonSchemas.varchar(32),
      'high_school': commonSchemas.varchar(255),
      'church': commonSchemas.varchar(255)
    },
    'anyOf': [
            { 'required': ['tpb_nim'] },
            { 'required': ['nim'] },
            { 'required': ['year'] },
            { 'required': ['department'] },
            { 'required': ['name'] },
            { 'required': ['gender'] },
            { 'required': ['birth_date'] },
            { 'required': ['phone'] },
            { 'required': ['line'] },
            { 'required': ['high_school'] },
            { 'required': ['church'] }
    ]
  }

};

module.exports = _.mapValues(schemas, validation.createValidator);
