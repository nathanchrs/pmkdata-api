'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const _ = require('lodash');
const queries = require('./mentees.queries');
const validators = require('./mentees.validators');

const router = express.Router();

/**
 * Get a list of mentees.
 * @name Get mentees
 * @route {GET} /mentees
 */
router.get('/mentees', auth.middleware.isSupervisor, validators.listMentees, (req, res, next) => {
  return queries.listMentees(req.query.search, req.query.page, req.query.perPage, req.query.sort)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Creates a new mentee
 * @name Create mentee
 * @route {POST} /mentees
 */
router.post('/mentees', auth.middleware.isSupervisor, validators.createMentee, (req, res, next) => {
  let newMentee = _.pick(req.body, ['mentor_id', 'mentee_id', 'notes']);
  newMentee.created_at = newMentee.updated_at = new Date();

  return queries.createMentee(newMentee)
    .then((insertedId) => {
      let insertedMentee = newMentee;
      insertedMentee['id'] = insertedId;
      return res.status(201).json(insertedMentee);
    })
    .catch(next);
});

/**
 * Get specific mentee information for the given id.
 * @name Get mentee info
 * @route {GET} /mentees/:id
 */
router.get('/mentees/:id', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.getMentee(req.params.id)
    .then((mentee) => {
      if (!mentee) return next(new errors.NotFound('Mentee not found. '));
      return res.json(mentee);
    })
    .catch(next);
});

/**
 * Updates mentee information for the given id.
 * @name Update mentee
 * @route {PATCH} /mentees/:id
 */
router.patch('/mentees/:id', auth.middleware.isSupervisor, validators.updateMentee, (req, res, next) => {
  let menteeUpdates = _.pick(req.body, ['mentor_id', 'mentee_id', 'notes']);
  menteeUpdates.updated_at = new Date();

  return queries.updateMentee(req.params.id, menteeUpdates)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

/**
 * Delete the specified mentee.
 * @name Delete mentee
 * @route {DELETE} /mentees/:id
 */
router.delete('/mentees/:id', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.deleteMentee(req.params.id)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

module.exports = router;
