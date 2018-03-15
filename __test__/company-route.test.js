'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

const User = require('../model/user.js');
const Profile = require('../model/profile.js');
const Company = require('../model/company.js');
const { exampleUser, exampleProfile, exampleCompany, exampleCompany2 } = require('./lib/mock-data.js');

const url = `http://localhost:${PORT}`;

require('jest');

describe('Company Routes', function() {
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
    ])
      .then( () => done())
      .catch(done);
  });
  describe('POST: /api/profile/:profileId/company', function() {
    
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
    afterAll( done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return a company with a valid token and data', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company`)
        .set({ Authorization: `Bearer ${this.tempToken}`})
        .send(exampleCompany)
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.companyName).toEqual(exampleCompany.companyName);
          expect(res.body.website).toEqual(exampleCompany.website);
          expect(res.body.profileId).toEqual(this.tempProfile._id.toString());
          expect(res.body.userId).toEqual(this.tempUser._id.toString());
          done();
        });
    });
    it('should return a 401 error without valid token', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company`)
        .send(exampleCompany)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
    it('should return a 400 error without valid body', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.text).toEqual('BadRequestError');
          done();
        });
    });
    it('should return a 404 error with an invalid request', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/companyz`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(typeof res.text).toEqual('string');
          done();
        });
    });
  });
  describe('GET: /api/profile/:profileId/company/:companyId', function() {
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
    beforeAll( done => {
      exampleCompany.userId = this.tempUser._id.toString();
      exampleCompany.profileId = this.tempProfile._id.toString();
      new Company(exampleCompany).save()
        .then( company => {
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
    afterAll(done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return a company when provided valid token and body', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.companyName).toEqual(this.tempCompany.companyName);
          expect(res.body.website).toEqual(this.tempCompany.website);
          expect(res.body.profileId).toEqual(this.tempProfile._id.toString());
          expect(res.body.userId).toEqual(this.tempUser._id.toString());
          expect(this.tempProfile.companies).toContain(res.body._id);
          done();
        });
    });
    it('should return a 404 error when submitted with invalid id', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/1234`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(typeof res.text).toEqual('string');
          done();
        });
    });
    it('should return a 401 error when sent without token', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}`)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
  });
  describe('GET: /api/profile/:profileId/company', function() {
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
    beforeAll( done => {
      exampleCompany.userId = this.tempUser._id.toString();
      exampleCompany.profileId = this.tempProfile._id.toString();
      new Company(exampleCompany).save()
        .then( company => {
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
      // instantiating second example company in order to test population of multiple companies
      exampleCompany2.userId = this.tempUser._id.toString();
      exampleCompany2.profileId = this.tempProfile._id.toString();
      new Company(exampleCompany2).save()
        .then( company => {
          this.tempCompany2 = company;
          this.tempProfile.companies.push(this.tempCompany2._id);
          return this.tempProfile.save();
        })
        .then(profile => {
          this.tempProfile = profile;
          done();
        })
        .catch(done);
    });
    afterAll(done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return a company when provided valid token and body', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(typeof res.body.companies).toEqual('object');
          expect(res.body.name).toEqual(this.tempProfile.name);
          expect(res.body.companies[0].profileId).toEqual(this.tempProfile._id.toString());
          expect(res.body.companies[1].profileId).toEqual(this.tempProfile._id.toString());
          done();
        });
    });
    it('should return a 404 error when submitted with invalid profile id', done => {
      request.get(`${url}/api/profile/12345/company`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.text).toEqual('NotFoundError');
          done();
        });
    });
    it('should return a 401 error when sent without token', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company`)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
  });
  describe('PUT: /api/profile/:profileId/company/:companyId', function () {
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
    afterAll(done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return an updated company when provided valid token and body', done => {
      let updatedCompany = { companyName: 'FaceLook'};
      request.put(`${url}/api/profile/${this.tempCompany.profileId}/company/${this.tempCompany._id}`)
        .send(updatedCompany)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.companyName).toEqual(updatedCompany.companyName);
          expect(res.body.website).toEqual(this.tempCompany.website);
          expect(res.body.profileId).toEqual(this.tempProfile._id.toString());
          expect(res.body.userId).toEqual(this.tempUser._id.toString());
          expect(this.tempProfile.companies).toContain(res.body._id);
          done();
        });
    });
    it('should return a 404 error when submitted without id', done => {
      let updatedCompany = { companyName: 'FaceLook' };
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/1234`)
        .send(updatedCompany)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(typeof res.text).toEqual('string');
          done();
        });
    });
    it('should return a 401 error when sent without token', done => {
      let updatedCompany = { companyName: 'FaceLook' };
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}`)
        .send(updatedCompany)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
    it('should return a 400 error', done => {
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(400);
          expect(res.text).toEqual('BadRequestError');
          done();
        });
    });
  });
  describe('DELETE: /api/profile/:profileId/company/:companyId', function () {
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
    it('should delete a company', done => {
      request.delete(`${url}/api/profile/${this.tempCompany.profileId}/company/${this.tempCompany._id}`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          console.log(res.body)
          expect(res.status).toEqual(204);
          expect(typeof res.body).toEqual('object');
          done();
        });
    });
  });
});