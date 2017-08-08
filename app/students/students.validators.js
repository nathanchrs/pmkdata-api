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
      'department': commonSchemas.department,
      'name': commonSchemas.varchar(255),
      'gender': commonSchemas.gender,
      'birth_date': commonSchemas.date,
      'phone': commonSchemas.phone,
      'line': commonSchemas.line,
      'high_school': commonSchemas.varchar(255),
      'church': commonSchemas.varchar(255),
      'bandung_address': commonSchemas.varchar(255),
      'hometown_address': commonSchemas.varchar(255),
      'parent_phone': commonSchemas.phone
    },
    'required': ['year', 'department', 'name', 'gender', 'birth_date', 'phone', 'line', 'high_school', 'church', 'bandung_address', 'hometown_address', 'parent_phone']
  },

  updateStudent: {
    'type': 'object',
    'properties': {
      'tpb_nim': commonSchemas.nim,
      'nim': commonSchemas.nim,
      'year': commonSchemas.year,
      'department': commonSchemas.department,
      'name': commonSchemas.varchar(255),
      'gender': commonSchemas.gender,
      'birth_date': commonSchemas.date,
      'phone': commonSchemas.phone,
      'line': commonSchemas.line,
      'high_school': commonSchemas.varchar(255),
      'church': commonSchemas.varchar(255),
      'bandung_address': commonSchemas.varchar(255),
      'hometown_address': commonSchemas.varchar(255),
      'parent_phone': commonSchemas.phone
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
      { 'required': ['church'] },
      { 'required': ['bandung_adddress'] },
      { 'required': ['hometown_address'] },
      { 'required': ['parent_phone'] }
    ]
  }

};

module.exports = _.mapValues(schemas, validation.createValidator);
