/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const sinonChai = require('sinon-chai');
chai.use(chaiHttp);
chai.use(sinonChai);
const sinon = require('sinon');
const expect = chai.expect;
const should = chai.should();
const knex = require('../components/knex');
const routes = require('../app');
const queries = require('./users.queries');

describe('User handling', function() {
    afterEach((done) => {
        knex.migrate.rollback()
            .then(() => {
                knex.migrate.latest()
                    .then(() => {
                        knex.seed.run()
                            .then(() => {
                                done();
                            })
                    });
            });
    });

    describe('new user', function() {
        let createNewUser = {
            "nim": 13515073,
            "username": "raydreww",
            "email": "raydreww@gmail.com",
            "password": "hello123"
        };

        it('should create new user if req.user is not falsy', (done) => {
            chai.request(routes).post('/users').send(createNewUser).end((err, res) => {
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
                chai.request(routes).get('/users/' + createNewUser.username).end((errfromget, resfromget) => {
                    expect(resfromget).to.have.status(401);
                    expect(resfromget.body.message).to.equal('Unauthorized');
                    expect(resfromget.body.name).to.equal('UnauthorizedError');
                    done();
                    11
                });
            });
        });

        it('should not delete user if user is not supervisor', (done) => {
            chai.request(routes).post('/users').send(createNewUser).end((err, res) => {
                chai.request(routes).delete('/users/' + createNewUser.username).end((errfromdel, resfromdel) => {
                    expect(resfromdel).to.have.status(401);
                    expect(resfromdel.body.message).to.equal('Unauthorized');
                    expect(resfromdel.body.name).to.equal('UnauthorizedError');
                    done();
                    11
                });
            });
        });

        it('should not edit user if user is not supervisor or not user him/herself', (done) => {
            chai.request(routes).post('/users').send(createNewUser).end((err, res) => {
                chai.request(routes).patch('/users/' + createNewUser.username).send({ nim: 13515074 }).end((errfromdel, resfromdel) => {
                    expect(resfromdel).to.have.status(401);
                    expect(resfromdel.body.message).to.equal('Unauthorized');
                    expect(resfromdel.body.name).to.equal('UnauthorizedError');
                    done();
                });
            });
        });
    });
});