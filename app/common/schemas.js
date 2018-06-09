'use strict';

const constants = require('./constants');

const schemas = {
  auto_id: {
    'type': 'integer',
    'minimum': 0
  },

  varchar: (length) => {
    let schema = {
      'type': 'string'
    };

    if (length) schema.maxLength = length;
    return schema;
  },

  text: {
    'type': 'string'
  },

  department: {
    'type': 'string',
    'enum': ['FITB', 'FMIPA', 'FSRD', 'FTI', 'FTMD', 'FTTM', 'FTSL', 'SAPPK', 'SBM', 'SF', 'SITH', 'STEI']
  },

  datetime: {
    'type': 'string',
    'format': 'date-time'
  },

  date: {
    'type': 'string',
    'format': 'date'
  },

  year: {
    'type': 'integer',
    'minimum': 1990,
    'maximum': 2089
  },

  gender: {
    'type': 'string',
    'enum': [constants.gender.MALE, constants.gender.FEMALE]
  },

  phone: {
    'type': 'string',
    'maxLength': 16
  },

  line: {
    'type': 'string',
    'maxLength': 32,
    'pattern': '^[a-zA-Z0-9@!#*+=/.,<>?~_-]+$'
  },

  nim: {
    'type': ['integer', 'null'],
    'minimum': 10000000,
    'maximum': 20000000
  },

  username: {
    'type': 'string',
    'maxLength': 255,
    'pattern': '^[a-zA-Z0-9_]+$'
  },

  email: {
    'type': 'string',
    'format': 'email',
    'maxLength': 255
  },

  password: {
    'type': 'string',
    'minLength': 6,
    'maxLength': 255
  },

  userStatus: {
    'type': 'string',
    'enum': [constants.userStatus.ACTIVE, constants.userStatus.AWAITING_VALIDATION, constants.userStatus.DISABLED]
  },

  pagingAndSortingProperties: {
    'page': {
      'type': 'integer',
      'minimum': 1
    },
    'perPage': {
      'type': 'integer',
      'minimum': 1
    },
    'sort': {
      'type': 'string'
    }
  },

  searchingProperties: {
    'search': {
      'type': 'string'
    }
  }

};

module.exports = schemas;
