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
      Job.remove({}),
    ])
      .then( () => done())
      .catch(done);
  });
  describe('POST: /api/profile/:profileId/company/:companyId/job', function() {
    beforeAll( done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then( user => user.save())
        .then( user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then(token => {
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
    afterAll( done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return a job with a valid token and data', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .send(exampleJob)
        .end((err, res) => {
          if (err) return done(err);
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
    it('should return a 401 error without valid token', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job`)
        .send(exampleJob)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
    it('should return a 400 error without valid body', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(typeof res.text).toEqual('string');
          done();
        });
    });
  });
  describe('GET: /api/profile/:profileId/company/:companyId/job/:jopbId', function () {
    beforeAll(done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then(token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleProfile.userId = this.tempUser._id.toString();
      new Profile(exampleProfile).save()
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleCompany.userId = this.tempUser._id.toString();
      exampleCompany.profileId = this.tempProfile._id.toString();
      new Company(exampleCompany).save()
        .then(company => {
          this.tempCompany = company;
          this.tempProfile.companies.push(this.tempCompany._id);
          return this.tempProfile.save();
        })
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll( done => {
      exampleJob.userId = this.tempUser._id.toString();
      exampleJob.profileId = this.tempProfile._id.toString();
      exampleJob.companyId = this.tempCompany._id.toString();
      new Job(exampleJob).save()
        .then( job => {
          this.tempJob = job;
          this.tempCompany.jobPosting.push(this.tempJob._id);
          return this.tempCompany.save();
        })
        .then( company => {
          this.tempCompany = company;
          done();
        })
        .catch(done);
    });
    afterAll(done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return a company when provided valid token and body', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job/${this.tempJob._id}`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          if (err) return done(err);
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
    it('should return a 401 error when sent without token', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job/${this.tempJob._id}`)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
    it('should return a 404 error when submitted with invalid id', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job/1234`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(typeof res.text).toEqual('string');
          done();
        });
    });
  });
  describe('GET: /api/profile/:profileId/allProfileJobs', function () {
    beforeAll(done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then(token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleProfile.userId = this.tempUser._id.toString();
      new Profile(exampleProfile).save()
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleCompany.userId = this.tempUser._id.toString();
      exampleCompany.profileId = this.tempProfile._id.toString();
      new Company(exampleCompany).save()
        .then(company => {
          this.tempCompany = company;
          this.tempProfile.companies.push(this.tempCompany._id);
          return this.tempProfile.save();
        })
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll( done => {
      exampleJob.userId = this.tempUser._id.toString();
      exampleJob.profileId = this.tempProfile._id.toString();
      exampleJob.companyId = this.tempCompany._id.toString();
      new Job(exampleJob).save()
        .then( job => {
          this.tempJob = job;
          this.tempCompany.jobPosting.push(this.tempJob._id);
          return this.tempCompany.save();
        })
        .then( company => {
          this.tempCompany = company;
          done();
        })
        .catch(done);
    });
    afterAll(done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return all of a profile\'s associated jobs when provided valid token and body', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/allProfileJobs`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body[0].title).toEqual(this.tempJob.title);
          expect(res.body[0].status).toEqual(this.tempJob.status);
          expect(res.body[0].profileId).toEqual(this.tempProfile._id.toString());
          done();
        });
    });
    it('should return a 404 error when submitted with invalid id', done => {
      request.get(`${url}/api/profile/12345/allProfileJobs`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.text).toEqual('NotFoundError');
          done();
        });
    });
    it('should return a 401 error when sent without token', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/allProfileJobs`)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
  });
  describe('GET: /api/profile/:profileId/allProfileJobs', function () {
    beforeAll(done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then(token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleProfile.userId = this.tempUser._id.toString();
      new Profile(exampleProfile).save()
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleCompany.userId = this.tempUser._id.toString();
      exampleCompany.profileId = this.tempProfile._id.toString();
      new Company(exampleCompany).save()
        .then(company => {
          this.tempCompany = company;
          this.tempProfile.companies.push(this.tempCompany._id);
          return this.tempProfile.save();
        })
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll( done => {
      exampleJob.userId = this.tempUser._id.toString();
      exampleJob.profileId = this.tempProfile._id.toString();
      exampleJob.companyId = this.tempCompany._id.toString();
      new Job(exampleJob).save()
        .then( job => {
          this.tempJob = job;
          this.tempCompany.jobPosting.push(this.tempJob._id);
          return this.tempCompany.save();
        })
        .then( company => {
          this.tempCompany = company;
          done();
        })
        .catch(done);
    });
    afterAll(done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return all of a profile\'s associated jobs when provided valid token and body', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/allProfileJobs`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body[0].title).toEqual(this.tempJob.title);
          expect(res.body[0].status).toEqual(this.tempJob.status);
          done();
        });
    });
    it('should return a 404 error when submitted with invalid id', done => {
      request.get(`${url}/api/profile/12345/allProfileJobs`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.text).toEqual('NotFoundError');
          done();
        });
    });
    it('should return a 401 error when sent without token', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/allProfileJobs`)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
  });
  describe('GET: /api/profile/:profileId/company/:companyId/allCompanyJobs', function () {
    beforeAll(done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then(token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleProfile.userId = this.tempUser._id.toString();
      new Profile(exampleProfile).save()
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleCompany.userId = this.tempUser._id.toString();
      exampleCompany.profileId = this.tempProfile._id.toString();
      new Company(exampleCompany).save()
        .then(company => {
          this.tempCompany = company;
          this.tempProfile.companies.push(this.tempCompany._id);
          return this.tempProfile.save();
        })
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll( done => {
      exampleJob.userId = this.tempUser._id.toString();
      exampleJob.profileId = this.tempProfile._id.toString();
      exampleJob.companyId = this.tempCompany._id.toString();
      new Job(exampleJob).save()
        .then( job => {
          this.tempJob = job;
          this.tempCompany.jobPosting.push(this.tempJob._id);
          return this.tempCompany.save();
        })
        .then( company => {
          this.tempCompany = company;
          done();
        })
        .catch(done);
    });
    afterAll(done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return all of a profile\'s associated jobs when provided valid token and body', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/allCompanyJobs`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body[0].title).toEqual(this.tempJob.title);
          expect(res.body[0].status).toEqual(this.tempJob.status);
          expect(res.body[0].profileId).toEqual(this.tempProfile._id.toString());
          done();
        });
    });
    it('should return a 404 error when submitted with invalid id', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/12345/allCompanyJobs`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(typeof res.text).toEqual('string');
          done();
        });
    });
    it('should return a 401 error when sent without token', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/allCompanyJobs`)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
  });
  describe('PUT: /api/profile/:profileId/company/:companyId/job/:jobId', function () {
    beforeAll(done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then(token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleProfile.userId = this.tempUser._id.toString();
      new Profile(exampleProfile).save()
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleCompany.userId = this.tempUser._id.toString();
      exampleCompany.profileId = this.tempProfile._id.toString();
      new Company(exampleCompany).save()
        .then(company => {
          this.tempCompany = company;
          this.tempProfile.companies.push(this.tempCompany._id);
          return this.tempProfile.save();
        })
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll( done => {
      exampleJob.userId = this.tempUser._id.toString();
      exampleJob.profileId = this.tempProfile._id.toString();
      exampleJob.companyId = this.tempCompany._id.toString();
      new Job(exampleJob).save()
        .then( job => {
          this.tempJob = job;
          this.tempCompany.jobPosting.push(this.tempJob._id);
          return this.tempCompany.save();
        })
        .then( company => {
          this.tempCompany = company;
          done();
        })
        .catch(done);
    });
    afterAll(done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return an updated company when provided valid token and body', done => {
      let updatedJob = { title: 'newTitle' };
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job/${this.tempJob._id}`)
        .send(updatedJob)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.title).toEqual(updatedJob.title);
          expect(res.body.link).toEqual(exampleJob.link);
          expect(res.body.status).toEqual(exampleJob.status);
          expect(this.tempUser._id.toString()).toEqual(res.body.userId);
          expect(this.tempProfile._id.toString()).toEqual(res.body.profileId);
          expect(this.tempCompany._id.toString()).toEqual(res.body.companyId);
          done();
        });
    });
    it('should return a 401 error when sent without token', done => {
      let updatedJob = { title: 'newTitle' };
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job/${this.tempJob._id}`)
        .send(updatedJob)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
    it('should return a 404 error when submitted without id', done => {
      let updatedJob = { title: 'newTitle' };
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job/1234`)
        .send(updatedJob)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(typeof res.text).toEqual('string');
          done();
        });
    });
    it('should return a 400 error', done => {
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job/${this.tempJob._id}`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.text).toEqual('BadRequestError');
          done();
        });
    });
  });
  describe('DELETE: /api/profile/:profileId/company/:companyId/job/:jobId', function () {
    beforeAll(done => {
      new User(exampleUser)
        .generatePasswordHash(exampleUser.password)
        .then(user => user.save())
        .then(user => {
          this.tempUser = user;
          return user.generateToken();
        })
        .then(token => {
          this.tempToken = token;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleProfile.userId = this.tempUser._id.toString();
      new Profile(exampleProfile).save()
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll(done => {
      exampleCompany.userId = this.tempUser._id.toString();
      exampleCompany.profileId = this.tempProfile._id.toString();
      new Company(exampleCompany).save()
        .then(company => {
          this.tempCompany = company;
          this.tempProfile.companies.push(this.tempCompany._id);
          return this.tempProfile.save();
        })
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    beforeAll( done => {
      exampleJob.userId = this.tempUser._id.toString();
      exampleJob.profileId = this.tempProfile._id.toString();
      exampleJob.companyId = this.tempCompany._id.toString();
      new Job(exampleJob).save()
        .then( job => {
          this.tempJob = job;
          this.tempCompany.jobPosting.push(this.tempJob._id);
          return this.tempCompany.save();
        })
        .then( company => {
          this.tempCompany = company;
          done();
        })
        .catch(done);
    });
    it('should delete a Job with a valid token and data', done => {
      request.delete(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/job/${this.tempJob._id}`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(204);
          expect(typeof res.body).toEqual('object');
          done();
        });
    });
  });
});