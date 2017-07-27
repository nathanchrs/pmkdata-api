'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const _ = require('lodash');
const queries = require('./students.queries');
const validators = require('./students.validators');

const router = express.Router();

/**
 * Get a list of students.
 * @name Get students
 * @route {GET} /students
 */
router.get('/students', auth.middleware.isSupervisor, validators.listStudents, (req, res, next) => {
  return queries.listStudents(req.query.search, req.query.page, req.query.perPage, req.query.sort)
    .then((result) => {
      return res.json(result);
    })
    .catch(next);
});

/**
 * Creates a new student
 * @name Create student
 * @route {POST} /students
 */
router.post('/students', validators.createStudent, (req, res, next) => {
  let newStudent = _.pick(req.body, ['tpb_nim', 'nim', 'year', 'department', 'name', 'gender', 'birth_date', 'phone', 'line', 'high_school', 'church']);
  newStudent.created_at = newStudent.updated_at = new Date();

  return queries.createStudent(newStudent)
    .then((insertedId) => {
      let insertedStudent = newStudent;
      insertedStudent['id'] = insertedId;
      return res.status(201).json(insertedStudent);
    })
    .catch(next);
});

/**
 * Get specific student information for the given id.
 * @name Get student info
 * @route {GET} /students/:id
 */
router.get('/students/:id', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.getStudent(req.params.id)
    .then((student) => {
      if (!student) return next(new errors.NotFound('Student not found. '));
      return res.json(student);
    })
    .catch(next);
});

/**
 * Updates student information for the given id.
 * @name Update student
 * @route {PATCH} /students/:id
 */
router.patch('/students/:id', auth.middleware.isSupervisor, validators.updateStudent, (req, res, next) => {
  let studentUpdates = _.pick(req.body, ['tpb_nim', 'nim', 'year', 'department', 'name', 'gender', 'birth_date', 'phone', 'line', 'high_school', 'church']);
  studentUpdates.updated_at = new Date();

  return queries.updateStudent(req.params.id, studentUpdates)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

/**
 * Delete the specified student.
 * @name Delete student
 * @route {DELETE} /students/:id
 */
router.delete('/students/:id', auth.middleware.isSupervisor, (req, res, next) => {
  return queries.deleteStudent(req.params.id)
    .then((affectedRowCount) => {
      return res.json({ affectedRowCount: affectedRowCount });
    })
    .catch(next);
});

module.exports = router;
