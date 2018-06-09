'use strict';

const knex = require('../common/knex');
const { withParams } = require('../common/knexutils');
const _ = require('lodash');

const studentColumns = [
  'id', 'tpb_nim', 'nim', 'year', 'department', 'name', 'gender', 'birth_date',
  'phone', 'parent_phone', 'line', 'current_address', 'hometown_address', 'high_school', 'church',
  'created_at', 'updated_at'
];

const studentAssignableColumns = [
  'tpb_nim', 'nim', 'year', 'department', 'name', 'gender', 'birth_date',
  'phone', 'parent_phone', 'line', 'current_address', 'hometown_address', 'high_school', 'church'
];

const studentSortableColumns = [
  'id', 'tpb_nim', 'nim', 'year', 'department', 'name', 'gender', 'birth_date',
  'phone', 'parent_phone', 'line', 'high_school', 'church',
  'created_at', 'updated_at'
];

const studentFilters = {
  id: { operator: '=' },
  tpb_nim: {},
  nim: {},
  department: { operator: '=' },
  name: {},
  year: { operator: '=' },
  gender: { operator: '=' },
  phone: {},
  parent_phone: {},
  line: {},
  current_address: {},
  hometown_address: {},
  high_school: {},
  church: {},
  createdSince: { field: 'created_at', operator: '>=' },
  createdUntil: { field: 'created_at', operator: '<=' },
  updatedSince: { field: 'updated_at', operator: '>=' },
  updatedUntil: { field: 'updated_at', operator: '<=' }
};

module.exports = {

  listStudents: (params) => {
    const query = knex.select(studentColumns).from('students');
    return withParams(knex, query, {
      filters: studentFilters,
      sortableFields: studentSortableColumns
    }, params);
  },

  searchStudents: (search) => {
    return knex.select(['id', 'name', 'department', 'year'])
      .from('students')
      .where('name', 'like', '%' + search + '%')
      .limit(20);
  },

  createStudent: (newStudent) => {
    newStudent = _.pick(newStudent, studentAssignableColumns);
    newStudent.created_at = newStudent.updated_at = new Date();
    return knex('students').insert(newStudent).then(insertedIds => Object.assign(newStudent, { id: insertedIds[0] }));
  },

  getStudent: (id) => {
    return knex.select(studentColumns)
      .from('students')
      .where('id', id)
      .first();
  },

  updateStudent: (id, studentUpdates) => {
    studentUpdates = _.pick(studentUpdates, studentAssignableColumns);
    studentUpdates.updated_at = new Date();
    return knex('students').update(studentUpdates).where('id', id);
  },

  deleteStudent: (id) => {
    return knex('students').delete().where('id', id);
  }

};
