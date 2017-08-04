'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const _ = require('lodash');
const queries = require('./events.queries');
const validators = require('./events.validators');

const router = express.Router();

/**
 * Get a list of events.
 * @name Get events
 * @route {GET} /events
 */
router.get('/events', auth.middleware.isSupervisor, validators.listEvents, (req, res, next) => {
  return queries.listEvents(req.query.search, req.query.page, req.query.perPage, req.query.sort)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Creates a new event
 * @name Create event
 * @route {POST} /events
 */
router.post('/events', validators.createEvent, (req, res, next) => {
  let newEvent = _.pick(req.body, ['name', 'description']);
  newEvent.created_at = newEvent.updated_at = new Date();

  return queries.createEvent(newEvent)
    .then((insertedId) => {
      let insertedEvent = newEvent;
      insertedEvent['id'] = insertedId;
      return res.status(201).json(insertedEvent);
    })
    .catch(next);
});

/**
 * Get specific event information for the given id.
 * @name Get event info
 * @route {GET} /events/:id
 */
router.get('/events/:id', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.getEvent(req.params.id)
    .then((event) => {
      if (!event) return next(new errors.NotFound('Event not found. '));
      return res.json(event);
    })
    .catch(next);
});

/**
 * Updates event information for the given id.
 * @name Update event
 * @route {PATCH} /events/:id
 */
router.patch('/events/:id', auth.middleware.isSupervisor, validators.updateEvent, (req, res, next) => {
  let eventUpdates = _.pick(req.body, ['name', 'description']);
  eventUpdates.updated_at = new Date();

  return queries.updateEvent(req.params.id, eventUpdates)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

/**
 * Delete the specified event.
 * @name Delete event
 * @route {DELETE} /events/:id
 */
router.delete('/events/:id', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.deleteEvent(req.params.id)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

module.exports = router;
