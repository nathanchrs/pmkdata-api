/* eslint-disable no-unused-expressions */
'use strict';

const chai = require('chai');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const sinon = require('sinon');
const expect = chai.expect;

const auth = require('./auth.js');

describe('Auth', function () {
  describe('isLoggedIn middleware', function () {
    it('should continue if req.user is not falsy', function () {
      const nextSpy = sinon.spy();
      auth.middleware.isLoggedIn({ user: {} }, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy).to.have.been.calledWithExactly();
    });

    it('should pass HTTP 401 if req.user is falsy', function () {
      const nextSpy = sinon.spy();
      auth.middleware.isLoggedIn({}, {}, nextSpy);
      expect(nextSpy).to.have.been.calledOnce;
      expect(nextSpy.args[0][0].status).to.be.equal(401);
    });
  });
});
