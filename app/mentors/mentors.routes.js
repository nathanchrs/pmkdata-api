'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const _ = require('lodash');
const queries = require('./mentors.queries');
const validators = require('./mentors.validators');

const router = express.Router();

/**
 * Get a list of mentors.
 * @name Get mentors
 * @route {GET} /mentors
 */
router.get('/mentors', auth.middleware.isSupervisor, validators.listMentors, (req, res, next) => {
  return queries.listMentors(req.query.search, req.query.page, req.query.perPage, req.query.sort)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Creates a new mentor
 * @name Create mentor
 * @route {POST} /mentors
 */
router.post('/mentors', validators.createMentor, (req, res, next) => {
  let newMentor = _.pick(req.body, ['mentor_username', 'event_id']);
  newMentor.created_at = newMentor.updated_at = new Date();

  return queries.createMentor(newMentor)
    .then((insertedId) => {
      let insertedMentor = newMentor;
      insertedMentor['id'] = insertedId;
      return res.status(201).json(insertedMentor);
    })
    .catch(next);
});

/**
 * Get specific mentor information for the given id.
 * @name Get mentor info
 * @route {GET} /mentors/:id
 */
router.get('/mentors/:id', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.getMentor(req.params.id)
    .then((mentor) => {
      if (!mentor) return next(new errors.NotFound('Mentor not found. '));
      return res.json(mentor);
    })
    .catch(next);
});

/**
 * Updates mentor information for the given id.
 * @name Update mentor
 * @route {PATCH} /mentors/:id
 */
router.patch('/mentors/:id', auth.middleware.isSupervisor, validators.updateMentor, (req, res, next) => {
  let mentorUpdates = _.pick(req.body, ['mentor_username', 'event_id']);
  mentorUpdates.updated_at = new Date();

  return queries.updateMentor(req.params.id, mentorUpdates)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

/**
 * Delete the specified mentor.
 * @name Delete mentor
 * @route {DELETE} /mentors/:id
 */
router.delete('/mentors/:id', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.deleteMentor(req.params.id)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

module.exports = router;
