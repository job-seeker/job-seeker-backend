'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

const User = require('../model/user.js');
const Profile = require('../model/profile.js');
const Company = require('../model/company.js');
const Contact = require('../model/contact.js');
const { exampleUser, exampleProfile, exampleCompany, exampleContact } = require('./lib/mock-data.js');

const url = `http://localhost:${PORT}`;

require('jest');

describe('Contact Routes', function() {
  beforeAll( done => {
    serverToggle.serverOn(server, done);
  });
  afterAll( done => {
    serverToggle.serverOff(server, done);
  });

  afterEach( done => {
    Promise.all([
      User.remove({}),
      Profile.remove({}),
      Company.remove({}),
      Contact.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });

  describe('POST: /api/profile/:profileId/company/:companyId/contact', () => {
    describe('with a valid token and data', () => {
      beforeAll( done => {
        new User(exampleUser)
          .generatePasswordHash(exampleUser.password)
          .then( user => user.save())
          .then( user => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then( token => {
            this.tempToken = token;
            done();
          })
          .catch(done);
      });
      beforeAll( done => {
        exampleProfile.userId = this.tempUser._id.toString();
        new Profile(exampleProfile).save()
          .then( profile => {
            this.tempProfile = profile;
            done();
          })
          .catch(done);
      });
      beforeAll( done => {
        exampleCompany.userId = this.tempUser._id.toString();
        exampleCompany.profileId = this.tempProfile._id.toString();
        new Company(exampleCompany).save()
          .then( company => {
            this.tempCompany = company;
            this.tempProfile.companies.push(this.tempCompany._id);
            return this.tempProfile.save();
          })
          .then( profile => {
            this.tempProfile = profile;
            done();
          })
          .catch(done);
      });
    });

    it('should return a 200 and a newly instantiated contact', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact`)
        .send(exampleContact)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual(exampleContact.name);
          expect(res.body.jobTitle).toEqual(exampleContact.jobTitle);
          expect(res.body.email).toEqual(exampleContact.email);
          expect(res.body.phone).toEqual(exampleContact.phone);
          expect(res.body.linkedIn).toEqual(exampleContact.linkedIn);          
          done();
        });
    });
    describe('without a valid token', () => {
      it('should return a 401 error', done => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact`)
          .send(exampleContact)
          .end((err, res) => {
            expect(res.status).toEqual(401);
            done();
          });
      });
    });
    describe('without sending a body', () => {
      it('should return a 400 error', done => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact`)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
    describe('with an invalid request', () => {
      it('should return a 404 error', done => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contactz`)
          .send(exampleContact)
          .set({
            Authorization: `Bearer ${this.tempToken}`,
          })
          .end((err, res) => {
            expect(res.status).toEqual(404);
            done();
          });
      });
    });
  });

  describe('GET : /api/profile/:profileId/company/:companyId/contact/:contactId', () => {

  });

  describe('PUT : /api/profile/:profileId/company/:companyId/contact/:contactId', () => {

  });

  describe('DELETE : /api/profile/:profileId/company/:companyId/contact/:contactId', () => {

  });
});
