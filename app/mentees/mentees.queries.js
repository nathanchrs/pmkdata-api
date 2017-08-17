'use strict';

var knex = require('../components/knex.js');
const _ = require('lodash');

const menteeColumns = ['id', 'user_id', 'student_id', 'notes', 'created_at', 'updated_at'];

module.exports = {
  isMentee: (userId, studentId) => {
    return knex.count('id as count')
      .from('mentees')
      .where('user_id', userId)
      .andWhere('student_id', studentId)
      .then(result => result[0].count > 0);
  },

  listMentees: (userId) => {
    return knex.select(menteeColumns.map(column => 'mentees.' + column + ' as ' + column).concat(['name', 'department', 'year']))
      .from('mentees')
      .where('user_id', userId)
      .leftJoin('students', 'mentees.student_id', 'students.id');
  },

  listMentors: (studentId) => {
    return knex.select(menteeColumns.map(column => 'mentees.' + column + ' as ' + column).concat(['username', 'name', 'department', 'year']))
      .from('mentees')
      .where('student_id', studentId)
      .leftJoin('users', 'mentees.user_id', 'users.id');
  },

  addMentee: (userId, studentId, notes) => {
    let newMentee = { user_id: userId, student_id: studentId, notes: notes };
    newMentee.created_at = newMentee.updated_at = new Date();
    return knex('mentees').insert(newMentee)
      .then(insertedIds => Object.assign(newMentee, { id: insertedIds[0] }));
  },

  removeMentee: (userId, studentId) => {
    return knex('mentees').delete()
      .where('user_id', userId)
      .andWhere('student_id', studentId);
  }

};
