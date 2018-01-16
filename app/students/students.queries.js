'use strict';

const knex = require('../components/knex.js');
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

const studentSearchableColumns = ['id', 'tpb_nim', 'nim', 'department', 'name', 'year', 'phone', 'parent_phone', 'line'];

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
  updatedUntil: { field: 'updated_at', operator: '<=' },
};

module.exports = {

  listStudents: (search, page, perPage, sort, filters) => {
    return knex.select(studentColumns)
      .from('students')
      .filter(filters, studentFilters)
      .search(search, studentSearchableColumns)
      .pageAndSort(page, perPage, sort, studentSortableColumns);
  },

  searchStudents: (search) => {
    return knex.select(['id', 'name', 'department', 'year'])
      .from('students')
      .search(search, ['name'])
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
