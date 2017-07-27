'use strict';

var knex = require('../components/knex.js');

module.exports = {
  listStudents: (search, page, perPage, sort) => {
    return knex.select('id', 'tpb_nim', 'nim', 'year', 'department', 'name', 'gender', 'birth_date', 'phone', 'line', 'high_school', 'church', 'created_at', 'updated_at')
      .from('students')
      .search(search, ['id', 'tpb_nim', 'nim', 'name', 'department', 'year'])
      .pageAndSort(page, perPage, sort, ['id', 'tpb_nim', 'nim', 'year', 'department', 'name', 'gender', 'birth_date', 'phone', 'line', 'high_school', 'church']);
  },

  createStudent: (newStudent) => {
    return knex('students').insert(newStudent);
  },

  getStudent: (id) => {
    return knex.select('id', 'tpb_nim', 'nim', 'year', 'department', 'name', 'gender', 'birth_date', 'phone', 'line', 'high_school', 'church', 'created_at', 'updated_at')
      .from('students')
      .where('id', id)
      .first();
  },

  updateStudent: (id, studentUpdates) => {
    return knex('students').update(studentUpdates).where('id', id);
  },

  deleteStudent: (id) => {
    return knex('students').delete().where('id', id);
  }

};
