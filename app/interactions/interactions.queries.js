'use strict';

const knex = require('../components/knex.js');
const _ = require('lodash');

const interactionColumns = ['id', 'time', 'title', 'notes', 'tags', 'created_at', 'updated_at'];
const interactionAssignableColumns = ['time', 'title', 'notes', 'tags'];
const interactionSearchableColumns = ['id', 'time', 'title', 'notes', 'tags'];
const interactionSortableColumns = ['id', 'time', 'title', 'tags', 'created_at', 'updated_at'];

const interactionMentorColumns = ['interaction_id', 'user_username', 'created_at'];
const interactionParticipantColumns = ['interaction_id', 'student_id', 'created_at'];

module.exports = {
  listInteractions: (search, page, perPage, sort, filterByMentorUsername) => {
    let query = knex.select(interactionColumns.map(column => 'interactions.' + column + ' as ' + column)).from('interactions');

    if (filterByMentorUsername) {
      query = query.leftJoin('interaction_mentors', 'interactions.id', 'interaction_mentors.interaction_id')
        .where('interaction_mentors.user_username', filterByMentorUsername);
    }

    return query
      .search(search, interactionSearchableColumns.map(column => 'interactions.' + column))
      .pageAndSort(page, perPage, sort, interactionSortableColumns.map(column => 'interactions.' + column));
  },

  createInteraction: (newInteraction) => {
    newInteraction = _.pick(newInteraction, interactionAssignableColumns);
    if (newInteraction.time) newInteraction.time = new Date(newInteraction.time);
    newInteraction.created_at = newInteraction.updated_at = new Date();
    // TODO: check returned inserted ID format for compound primary key
    return knex('interactions').insert(newInteraction).then(insertedIds => Object.assign(newInteraction, { id: insertedIds[0] }));
  },

  getInteraction: id => {
    return knex.select(interactionColumns)
      .from('interactions')
      .where('id', id)
      .first();
  },

  updateInteraction: (id, interactionUpdates) => {
    interactionUpdates = _.pick(interactionUpdates, interactionAssignableColumns);
    if (interactionUpdates.time) interactionUpdates.time = new Date(interactionUpdates.time);
    interactionUpdates.updated_at = new Date();
    return knex('interactions').update(interactionUpdates).where('id', id);
  },

  deleteInteraction: id => {
    return knex('interactions').delete().where('id', id);
  },

  isInteractionMentor: (interactionId, userUsername) => {
    return knex.count('id as count')
      .from('interaction_mentors')
      .where('interaction_id', interactionId)
      .andWhere('user_username', userUsername)
      .limit(1)
      .then(result => result[0].count > 0);
  },

  listInteractionMentors: interactionId => {
    return knex.select(interactionMentorColumns.map(column => 'interaction_mentors.' + column + ' as ' + column).concat(['username', 'name', 'department', 'year']))
      .from('interaction_mentors')
      .where('interaction_id', interactionId)
      .leftJoin('users', 'interaction_mentors.user_username', 'users.username')
      .leftJoin('students', 'users.nim', 'students.nim');
  },

  addInteractionMentor: (interactionId, userUsername) => {
    let newInteractionMentor = { interaction_id: interactionId, user_username: userUsername };
    newInteractionMentor.created_at = new Date();
    return knex('interaction_mentors').insert(newInteractionMentor)
      .then(insertedIds => Object.assign(newInteractionMentor, { id: insertedIds[0] }));
  },

  removeInteractionMentor: (interactionId, userUsername) => {
    return knex('interaction_mentors').delete()
      .where('interaction_id', interactionId)
      .andWhere('user_username', userUsername);
  },

  listInteractionParticipants: (interactionId) => {
    return knex.select(interactionParticipantColumns.map(column => 'interaction_participants.' + column + ' as ' + column).concat(['name', 'department', 'year']))
      .from('interaction_participants')
      .where('interaction_id', interactionId)
      .leftJoin('students', 'interaction_participants.student_id', 'students.id');
  },

  addInteractionParticipant: (interactionId, studentId) => {
    let newInteractionParticipant = { interaction_id: interactionId, student_id: studentId };
    newInteractionParticipant.created_at = new Date();
    return knex('interaction_participants').insert(newInteractionParticipant)
      .then(insertedIds => Object.assign(newInteractionParticipant, { id: insertedIds[0] }));
  },

  removeInteractionParticipant: (interactionId, studentId) => {
    return knex('interaction_participants').delete()
      .where('interaction_id', interactionId)
      .andWhere('student_id', studentId);
  }

};
