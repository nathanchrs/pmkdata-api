'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
chai.use(chaiHttp);
chai.use(sinonChai);
const expect = chai.expect;
const routes = require('../app');
const knex = require('../components/knex');
const winston = require('../components/winston');

describe('student handling', function () {
  beforeEach((done) => {
    knex.migrate.rollback()
            .then(() => {
              knex.migrate.latest()
                    .then(() => {
                      knex.seed.run()
                            .then(() => {
                              done();
                            });
                    });
            });
  });

  describe('new student', function () {
    let createNewStudent = {
      'year': 2015,
      'department': 'STEI',
      'name': 'Ray Andrew',
      'gender': 'man',
      'birth_date': '1997-11-11',
      'phone': '081933292950',
      'line': 'rayandrew',
      'high_school': 'SMA St.Thomas 1 Medan',
      'church': 'GKI Maulana Yusuf Bandung'
    };

    it('should create new student if req.student is not falsy', (done) => {
      chai.request(routes).post('/students').send(createNewStudent).end((err, res) => {
        if (err) winston.info(err);
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('created_at');
        expect(res.body.name).to.equal('Ray Andrew');
        done();
      });
    });

    it('should get specific students based on created student', (done) => {
      chai.request(routes).post('/students').send(createNewStudent).end((err, res) => {
        if (err) winston.info(err);
        chai.request(routes).get('/students/' + res.body.id).end((errfromget, resfromget) => {
          if (errfromget) winston.info(errfromget.message);
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should get list of students', (done) => {
      chai.request(routes).post('/students').send(createNewStudent).end((err, res) => {
        if (err) winston.info(err);
        chai.request(routes).get('/students').end((errfromget, resfromget) => {
          if (errfromget) winston.info(errfromget.message);
          console.log(resfromget.body.data);
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not delete student if student is not supervisor', (done) => {
      chai.request(routes).post('/students').send(createNewStudent).end((err, res) => {
        if (err) winston.info(err);
        chai.request(routes).delete('/students/' + res.body.id).end((errfromdel, resfromdel) => {
          if (errfromdel) winston.info(errfromdel.message);
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal('Unauthorized');
          expect(resfromdel.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not edit student if student is not supervisor or not student him/herself', (done) => {
      chai.request(routes).post('/students').send(createNewStudent).end((err, res) => {
        if (err) winston.info(err);
        chai.request(routes).patch('/students/' + res.body.id).send({ nim: 13515074 }).end((errfrompatch, resfrompatch) => {
          if (errfrompatch) winston.info(errfrompatch.message);
          expect(resfrompatch).to.have.status(401);
          expect(resfrompatch.body.message).to.equal('Unauthorized');
          expect(resfrompatch.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });
  });
});
