'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const queries = require('./interactions.queries');
const validators = require('./interactions.validators');

const router = express.Router();

/** Custom auth middleware that checks whether the accessing user is a participating mentor for this interaction. */
const isInteractionMentorOrSupervisor = auth.createMiddlewareFromPredicate((user, req) => {
  if (auth.predicates.isSupervisor(user)) return true;
  return queries.isInteractionMentor(req.params.id, req.user.id);
});

/**
 * Get a list of interactions.
 * @name Get interactions
 * @route {GET} /interactions
 */
router.get('/interactions', auth.middleware.isLoggedIn, validators.listInteractions, (req, res, next) => {
  const filterByMentorId = auth.predicates.isSupervisor(req.user) ? false : req.user.id;
  return queries.listInteractions(req.query.search, req.query.page, req.query.perPage, req.query.sort, filterByMentorId)
    .then(result => res.json(result))
    .catch(next);
});

/**
 * Creates a new interaction
 * @name Create interaction
 * @route {POST} /interactions
 */
router.post('/interactions', auth.middleware.isLoggedIn, validators.createInteraction, (req, res, next) => {
  return queries.createInteraction(req.body)
    .then(insertedInteraction => res.status(201).json(insertedInteraction))
    .catch(next);
});

/**
 * Get specific interaction information for the given id.
 * @name Get interaction info
 * @route {GET} /interactions/:id
 */
router.get('/interactions/:id', isInteractionMentorOrSupervisor, (req, res, next) => {
  return queries.getInteraction(req.params.id)
    .then((interaction) => {
      if (!interaction) return next(new errors.NotFound('Interaction not found.'));
      return res.json(interaction);
    })
    .catch(next);
});

/**
 * Update interaction information for the given id.
 * @name Update interaction
 * @route {PATCH} /interactions/:id
 */
router.patch('/interactions/:id', isInteractionMentorOrSupervisor, validators.updateInteraction, (req, res, next) => {
  return queries.updateInteraction(req.params.id, req.body)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

/**
 * Delete the specified interaction.
 * @name Delete interaction
 * @route {DELETE} /interactions/:id
 */
router.delete('/interactions/:id', isInteractionMentorOrSupervisor, (req, res, next) => {
  return queries.deleteInteraction(req.params.id)
    .then(affectedRowCount => res.json({ affectedRowCount: affectedRowCount }))
    .catch(next);
});

/**
 * Get list of mentors for the given interaction.
 * @name Get interaction mentors
 * @route {GET} /interactions/:id/mentors
 */
router.get('/interactions/:id/mentors', isInteractionMentorOrSupervisor, (req, res, next) => {
  return queries.listInteractionMentors(req.params.id)
    .then(result => res.json(result))
    .catch(next);
});

/**
 * Add a mentor for the given interaction.
 * @name Add interaction mentor
 * WARNING: auth is supposed to be isInteractionMentorOrSupervisor, but changed to isLoggedIn to ease adding participants for new interactions.
 * @route {POST} /interactions/:id/mentors
 */
router.post('/interactions/:id/mentors', auth.middleware.isLoggedIn, validators.addInteractionMentor, (req, res, next) => {
  return queries.addInteractionMentor(req.params.id, req.body.user_id)
    .then(insertedInteractionMentor => res.status(201).json(insertedInteractionMentor))
    .catch(next);
});

/**
 * Remove a mentor from the given interaction.
 * @name Remove interaction mentor
 * @route {DELETE} /interactions/:id/mentors
 */
router.delete('/interactions/:id/mentors/:userId', isInteractionMentorOrSupervisor, (req, res, next) => {
  return queries.removeInteractionMentor(req.params.id, req.params.userId)
    .then(affectedRowCount => res.json({ affectedRowCount: affectedRowCount }))
    .catch(next);
});

/**
 * Get list of participants for the given interaction ID.
 * @name Get interaction participants
 * @route {GET} /interactions/:id/participants
 */
router.get('/interactions/:id/participants', isInteractionMentorOrSupervisor, (req, res, next) => {
  return queries.listInteractionParticipants(req.params.id)
    .then(result => res.json(result))
    .catch(next);
});

/**
 * Add a participant for the given interaction.
 * WARNING: auth is supposed to be isInteractionMentorOrSupervisor, but changed to isLoggedIn to ease adding participants for new interactions.
 * @name Add interaction participant
 * @route {POST} /interactions/:id/participants
 */
router.post('/interactions/:id/participants', auth.middleware.isLoggedIn, validators.addInteractionParticipant, (req, res, next) => {
  return queries.addInteractionParticipant(req.params.id, req.body.student_id)
    .then(insertedInteractionParticipant => res.status(201).json(insertedInteractionParticipant))
    .catch(next);
});

/**
 * Remove a participant from the given interaction.
 * @name Remove interaction participant
 * @route {DELETE} /interactions/:id/participants
 */
router.delete('/interactions/:id/participants/:studentId', isInteractionMentorOrSupervisor, (req, res, next) => {
  return queries.removeInteractionParticipant(req.params.id, req.params.studentId)
    .then(affectedRowCount => res.json({ affectedRowCount: affectedRowCount }))
    .catch(next);
});

module.exports = router;
