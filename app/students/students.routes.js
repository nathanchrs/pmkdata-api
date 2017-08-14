'use strict';

const express = require('express');
const auth = require('../components/auth.js');
const errors = require('http-errors');
const _ = require('lodash');
const queries = require('./students.queries');
const validators = require('./students.validators');
const config = require('config');

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
 * Creates a new student. Can be accessed publicly if publicStudentRegistration config is true.
 * @name Create student
 * @route {POST} /students
 */
router.post('/students', validators.createStudent, (req, res, next) => {
  const publicStudentRegistration = config.get('publicStudentRegistration');
  const isSupervisor = auth.predicates.isSupervisor(req.user);

  if (!isSupervisor && !publicStudentRegistration) return next(new errors.Forbidden());

  let editableColumns = ['tpb_nim', 'department', 'name', 'gender', 'birth_date', 'phone', 'parent_phone', 'line', 'current_address', 'hometown_address', 'high_school', 'church'];
  if (isSupervisor) {
    editableColumns = editableColumns.concat(['nim', 'year']);
  } else if (publicStudentRegistration) {
    req.body.year = (new Date()).getFullYear();
  }
  let newStudent = _.pick(req.body, editableColumns);

  if (newStudent.tpb_nim && !newStudent.nim) newStudent.nim = newStudent.tpb_nim;

  return queries.createStudent(newStudent)
    .then((insertedStudent) => {
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
      if (!student) return next(new errors.NotFound('Student not found.'));
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
  return queries.updateStudent(req.params.id, req.body)
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
