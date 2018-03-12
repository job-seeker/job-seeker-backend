'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

const User = require('../model/user.js');
const exampleUser = require('./lib/mock-user.js');

const url = `http://localhost:${PORT}`;

require('jest');

describe('User Auth Routes', function() {
  beforeAll( done => serverToggle.serverOn(server, done));
  afterAll( done => serverToggle.serverOff(server, done));

  describe('POST: /api/signup', function() {
    describe('with a valid body', function() {
      afterEach ( done => {
        User.remove({})
          .then( () => done())
          .catch(done);
      });
      it('should return a token', done => {
        request.post(`${url}/api/signup`)
          .send(exampleUser)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            // additional tests here
            done();
          });
      });
    });
    describe('without a valid body', function() {
      it('should return a 400 error', done => {
        request.post(`${url}/api/signup`)
          .send({})
          .end((err, res) => {
            expect(res.status).toEqual(400);
            expect(res.text).toEqual('BadRequestError');
            done();
          });
      });
    });
  });

  describe('GET: /api/signin', function() {
    describe('with a valid body', function() {
      beforeEach( done => {
        let user = new User(exampleUser);
        user.generatePasswordHash(exampleUser.password)
          .then( user => user.save())
          .then( user => {
            this.tempUser = user;
            done();
          })
          .catch(done);
      });
      afterEach( done => {
        User.remove({})
          .then( () => done())
          .catch(done);
      });
      it('should return a token', done => {
        request.get(`${url}/api/signin`)
          .auth(exampleUser.username, exampleUser.password)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            // additional tests here
            done();
          });
      });
    });
    describe('without a valid body', function() {
      it('should return a 401', done => {
        request.get(`${url}/api/signin`)
          .end((err, res) => {
            expect(res.status).toEqual(401);
            expect(res.text).toEqual('UnauthorizedError');
            done();
          });
      });
    });
    describe('with an invalid username and password', function() {
      it('should return a 500 error', done => {
        request.get(`${url}/api/signin`)
          .auth('fakeusername', 'fakepassword')
          .end((err, res) => {
            expect(res.status).toEqual(500);
            expect(res.text).toEqual('InternalServerError');
            done();
          });
      });
    });
  });
});