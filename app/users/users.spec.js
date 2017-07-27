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

describe('User handling', function () {
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

  after((done) => {
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

  describe('new user', function () {
    let createNewUser = {
      'nim': 13515073,
      'username': 'raydreww',
      'email': 'raydreww@gmail.com',
      'password': 'hello123'
    };

    it('should create new user if req.user is not falsy', (done) => {
      chai.request(routes).post('/users').send(createNewUser).end((err, res) => {
        if (err) winston.info(err);
        expect(res).to.have.status(201);
        expect(res).to.be.a('object');
        expect(res.body).to.be.a('object');
        expect(res.body).to.haveOwnProperty('created_at');
        expect(res.body.username).to.equal('raydreww');
        done();
      });
    });

    it('should not get list of users if user is not supervisor or him/herself', (done) => {
      chai.request(routes).post('/users').send(createNewUser).end((err, res) => {
        if (err) winston.info(err);
        chai.request(routes).get('/users/' + createNewUser.username).end((errfromget, resfromget) => {
          if (errfromget) winston.info(errfromget.message);
          expect(resfromget).to.have.status(401);
          expect(resfromget.body.message).to.equal('Unauthorized');
          expect(resfromget.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not delete user if user is not supervisor', (done) => {
      chai.request(routes).post('/users').send(createNewUser).end((err, res) => {
        if (err) winston.info(err);
        chai.request(routes).delete('/users/' + createNewUser.username).end((errfromdel, resfromdel) => {
          if (errfromdel) winston.info(errfromdel.message);
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal('Unauthorized');
          expect(resfromdel.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });

    it('should not edit user if user is not supervisor or not user him/herself', (done) => {
      chai.request(routes).post('/users').send(createNewUser).end((err, res) => {
        if (err) winston.info(err);
        chai.request(routes).patch('/users/' + createNewUser.username).send({ nim: 13515074 }).end((errfromdel, resfromdel) => {
          if (errfromdel) winston.info(errfromdel.message);
          expect(resfromdel).to.have.status(401);
          expect(resfromdel.body.message).to.equal('Unauthorized');
          expect(resfromdel.body.name).to.equal('UnauthorizedError');
          done();
        });
      });
    });
  });
});
