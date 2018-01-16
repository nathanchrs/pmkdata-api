'use strict';

const express = require('express');
const _ = require('lodash');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const queries = require('./interactions.queries');
const validators = require('./interactions.validators');

const router = express.Router();

/**
 * Check whether the current user is a participating mentor of this interaction.
 */
async function checkInteractionMentor (req) {
  return queries.isInteractionMentor(req.params.id, req.user.username);
}

/**
 * Get a list of all interactions.
 * 'owner' access modifier will cause only interactions for the current user to be shown.
 * @name List interactions
 * @route {GET} /interactions
 */
router.get('/interactions', auth.requirePrivilege('list-interactions', checkInteractionMentor), validators.listInteractions, async (req, res) => {
  const { page, perPage, sort, ...filters } = req.query;
  const filterByMentorUsername = _.includes(req.accessModifiers, auth.accessModifiers.ALL) ? false : req.user.username;
  const result = await queries.listInteractions({ page, perPage, sort, filters }, filterByMentorUsername);
  return res.json(result);
});

/**
 * Creates a new interaction
 * @name Create interaction
 * @route {POST} /interactions
 */
router.post('/interactions', auth.requirePrivilege('create-interaction'), validators.createInteraction, async (req, res) => {
  const insertedInteraction = await queries.createInteraction(req.body);
  return res.status(201).json(insertedInteraction);
});

/**
 * Get specific interaction information for the given ID.
 * @name View interaction info
 * @route {GET} /interactions/:id
 */
router.get('/interactions/:id', auth.requirePrivilege('view-interaction', checkInteractionMentor), async (req, res) => {
  const interaction = await queries.getInteraction(req.params.id);
  if (!interaction) throw new errors.NotFound('Interaction not found.');
  return res.json(interaction);
});

/**
 * Update interaction information for the given id.
 * @name Update interaction
 * @route {PATCH} /interactions/:id
 */
router.patch('/interactions/:id', auth.requirePrivilege('update-interaction', checkInteractionMentor), validators.updateInteraction, async (req, res) => {
  const affectedRowCount = await queries.updateInteraction(req.params.id, req.body);
  return res.json({ affectedRowCount });
});

/**
 * Delete the specified interaction.
 * @name Delete interaction
 * @route {DELETE} /interactions/:id
 */
router.delete('/interactions/:id', auth.requirePrivilege('delete-interaction', checkInteractionMentor), async (req, res) => {
  const affectedRowCount = await queries.deleteInteraction(req.params.id);
  return res.json({ affectedRowCount });
});

/**
 * Get list of mentors for the given interaction.
 * @name List interaction mentors
 * @route {GET} /interactions/:id/mentors
 */
router.get('/interactions/:id/mentors', auth.requirePrivilege('list-interaction-mentors', checkInteractionMentor), async (req, res) => {
  const result = await queries.listInteractionMentors(req.params.id);
  return res.json(result);
});

/**
 * Add a mentor for the given interaction.
 * @name Create interaction mentor
 * @route {POST} /interactions/:id/mentors
 */
router.post('/interactions/:id/mentors', auth.requirePrivilege('create-interaction-mentor', checkInteractionMentor), validators.addInteractionMentor, async (req, res) => {
  const insertedInteractionMentor = await queries.addInteractionMentor(req.params.id, req.body.user_username);
  return res.status(201).json(insertedInteractionMentor);
});

/**
 * Remove a mentor from the given interaction.
 * @name Delete interaction mentor
 * @route {DELETE} /interactions/:id/mentors/:userUsername
 */
router.delete('/interactions/:id/mentors/:userUsername', auth.requirePrivilege('delete-interaction-mentor', checkInteractionMentor), async (req, res) => {
  const affectedRowCount = await queries.removeInteractionMentor(req.params.id, req.params.userUsername);
  return res.json({ affectedRowCount });
});

/**
 * Get list of participants for the given interaction ID.
 * @name List interaction participants
 * @route {GET} /interactions/:id/participants
 */
router.get('/interactions/:id/participants', auth.requirePrivilege('list-interaction-participants', checkInteractionMentor), async (req, res) => {
  const result = await queries.listInteractionParticipants(req.params.id);
  return res.json(result);
});

/**
 * Add a participant for the given interaction.
 * @name Create interaction participant
 * @route {POST} /interactions/:id/participants
 */
router.post('/interactions/:id/participants', auth.requirePrivilege('create-interaction-participant', checkInteractionMentor), validators.addInteractionParticipant, async (req, res) => {
  const insertedInteractionParticipant = await queries.addInteractionParticipant(req.params.id, req.body.student_id);
  return res.status(201).json(insertedInteractionParticipant);
});

/**
 * Remove a participant from the given interaction.
 * @name Delete interaction participant
 * @route {DELETE} /interactions/:id/participants/:studentId
 */
router.delete('/interactions/:id/participants/:studentId', auth.requirePrivilege('delete-interaction-participant', checkInteractionMentor), async (req, res) => {
  const affectedRowCount = await queries.removeInteractionParticipant(req.params.id, req.params.studentId);
  return res.json({ affectedRowCount });
});

module.exports = router;
