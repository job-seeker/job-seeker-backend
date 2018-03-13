'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

const User = require('../model/user.js');
const Profile = require('../model/profile.js');
const Company = require('../model/company.js');
const Job = require('../model/job.js');
const {exampleUser, exampleProfile, exampleCompany, exampleJob} = require('./lib/mock-data.js');

const url = `http://localhost:${PORT}`;

require('jest');

describe('Job Routes', function() {
  beforeAll( done => serverToggle.serverOn(server, done));
  afterAll( done => serverToggle.serverOff(server, done));

  describe('/api/profile/:profileId/company/:companyId/job', function() {
    describe('with a valid token and data', function() {
      beforeAll( done => {
        new User(exampleUser)
          .generatePasswordHash(exampleUser.password)
          .then( user => user.save())
          .then( user => {
            this.tempUser = user;
            return user.generateToken();
          })
          .then ( token => {
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
            done();
          })
          .catch(done);
      });
      it('should return a job', done => {
        request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job`)
          .set({ Authorization: `Bearer ${this.tempToken}` })
          .send(exampleJob)
          .end((err, res) => {
            if (err) return done(err);
            console.log(res.body)
            expect(res.status).toEqual(200);
            expect(res.body.title).toEqual(exampleJob.title);
            expect(res.body.link).toEqual(exampleJob.link);
            expect(res.body.status).toEqual(exampleJob.status);
            expect(this.tempUser._id.toString()).toEqual(res.body.userId);
            expect(this.tempProfile._id.toString()).toEqual(res.body.profileId);
            expect(this.tempCompany._id.toString()).toEqual(res.body.companyId);
            done();
          });
      });
    });
  });
});