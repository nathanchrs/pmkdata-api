'use strict';

var knex = require('../components/knex.js');

module.exports = {
  listStudents: (search, page, perPage, sort) => {
    return knex.select('id', 'tpb_nim', 'nim', 'year', 'department', 'name', 'gender', 'birth_date', 'phone', 'line', 'high_school', 'church')
            .from('students')
            .search(search, ['id', 'name', 'gender', 'year'])
            .pageAndSort(page, perPage, sort, ['id', 'tpb_nim', 'nim', 'year', 'department', 'name', 'gender', 'birth_date', 'phone', 'line', 'high_school', 'church']);
  },

  createStudent: (newStudent) => {
    return knex('students').insert(newStudent);
  },

  getStudent: (id) => {
    return knex.select('id', 'tpb_nim', 'nim', 'year', 'department', 'name', 'gender', 'birth_date', 'phone', 'line', 'high_school', 'church')
            .from('students')
            .where('id', id)
            .first();
  },

  updateStudent: (id, studentUpdates) => {
    let promises = Promise.resolve();
    return promises
            .then(() => {
              return knex('students').update(studentUpdates).where('id', id);
            });
  },

  deleteStudent: (id) => {
    return knex('students').delete().where('id', id);
  }

};
