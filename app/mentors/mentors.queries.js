'use strict';

var knex = require('../components/knex.js');

module.exports = {
  listMentors: (search, page, perPage, sort, filter) => {
    if(filter) {
      return knex.select('id', 'mentor_username', 'event_id', 'status', 'created_at', 'updated_at')
      .from('mentors')
      .filter(JSON.parse(filter), {username : {field: 'mentor_username', operator: '='}, event : {field: 'event_id', operator: '='}})
      .search(search, ['id', 'mentor_username', 'event_id', 'status'])
      .pageAndSort(page, perPage, sort, ['id', 'mentor_username', 'event_id', 'status']);
    } else {
      return knex.select('id', 'mentor_username', 'event_id', 'status', 'created_at', 'updated_at')
      .from('mentors')
      .search(search, ['id', 'mentor_username', 'event_id', 'status'])
      .pageAndSort(page, perPage, sort, ['id', 'mentor_username', 'event_id', 'status']);
    }
  },

  createMentor: (newMentor) => {
    return knex('mentors').insert(newMentor);
  },

  getMentor: (id) => {
    return knex.select('id', 'mentor_username', 'event_id', 'status', 'created_at', 'updated_at')
      .from('mentors')
      .where('id', id)
      .first();
  },

  updateMentor: (id, mentorUpdates) => {
    return knex('mentors').update(mentorUpdates).where('id', id);
  },

  deleteMentor: (id) => {
    return knex('mentors').delete().where('id', id);
  }

};
