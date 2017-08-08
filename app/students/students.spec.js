/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
chai.use(chaiHttp);
chai.use(sinonChai);
const expect = chai.expect;
const routes = require('../app');
const knex = require('../components/knex');

describe('student handling', function () {
  beforeEach((done) => {
    knex.migrate.rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(() => done());
  });

  after((done) => {
    knex.migrate.rollback()
      .then(() => knex.migrate.latest())
      .then(() => knex.seed.run())
      .then(() => done());
  });

  describe('new student', function () {
    let createNewStudent = {
      'year': 2015,
      'department': 'STEI',
      'name': 'Ray Andrew',
      'gender': 'male',
      'birth_date': '1997-11-11',
      'phone': '081911111111',
      'parent_phone': '081911111111',
      'line': 'rayandrew',
      'high_school': 'SMA St.Thomas 1 Medan',
      'church': 'GKI Maulana Yusuf Bandung',
      'bandung_address': 'Jalan Ganesha no 10',
      'hometown_address': 'Jalan Sisingamangaraja Medan'
    };

    it('should return 201 after creating new student', (done) => {
      chai.request(routes).post('/api/students').send(createNewStudent).end((err, res) => {
        expect(err).to.be.falsy;
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('created_at');
        expect(res.body.line).to.equal('rayandrew');
        done();
      });
    });

    it('should not get specific student if not logged in', (done) => {
      chai.request(routes).post('/api/students').send(createNewStudent).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).get('/api/students/' + res.body.id).end((err, resfromget) => {
          expect(err).to.be.falsy;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not get list of students if not logged in', (done) => {
      chai.request(routes).post('/api/students').send(createNewStudent).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).get('/api/students').end((err, resfromget) => {
          expect(err).to.be.falsy;
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not delete student if not logged in', (done) => {
      chai.request(routes).post('/api/students').send(createNewStudent).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).delete('/api/students/' + res.body.id).end((err, resfromdel) => {
          expect(err).to.be.falsy;
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal('Unauthorized');
          expect(resfromdel.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not edit student if not logged in', (done) => {
      chai.request(routes).post('/api/students').send(createNewStudent).end((err, res) => {
        expect(err).to.be.falsy;
        chai.request(routes).patch('/api/students/' + res.body.id).send({ nim: 13515074 }).end((err, resfrompatch) => {
          expect(err).to.be.falsy;
          expect(resfrompatch).to.have.status(401);
          expect(resfrompatch.body.message).to.equal('Unauthorized');
          expect(resfrompatch.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });
  });
});
