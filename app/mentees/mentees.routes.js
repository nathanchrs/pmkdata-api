'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const queries = require('./mentees.queries.js');
const validators = require('./mentees.validators.js');

const router = express.Router();

/**
 * Add a mentee assignment
 * @name Add mentee assignment
 * @route {POST} /mentees
 */
router.post('/mentees', auth.middleware.isSupervisor, validators.addMentee, (req, res, next) => {
  return queries.addMentee(req.body.user_id, req.body.student_id, req.body.notes)
    .then(insertedMentee => res.status(201).json(insertedMentee))
    .catch(next);
});

/**
 * Remove a mentee asssignment
 * @name Remove mentee assignment
 * @route {DELETE} /mentees/:userId/:studentId
 */
router.delete('/mentees/:userId/:studentId', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.removeMentee(req.params.userId, req.params.studentId)
    .then(affectedRowCount => res.json({ affectedRowCount: affectedRowCount }))
    .catch(next);
});

module.exports = router;
