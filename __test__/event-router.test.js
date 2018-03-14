'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

const User = require('../model/user.js');
const Event = require('../model/event.js');
const Profile = require('../model/profile.js');
const Company = require('../model/company.js');
const { exampleUser, exampleProfile, exampleCompany, exampleEvent } = require('./lib/mock-data.js');

const url = `http://localhost:${PORT}`;

require('jest');

describe('Event Routes', function () {
  beforeAll(done => {
    serverToggle.serverOn(server, done);
  });
  afterAll(done => {
    serverToggle.serverOff(server, done);
  });
  afterEach(done => {
    Promise.all([
      User.remove({}),
      Profile.remove({}),
      Company.remove({}),
      Event.remove({}),
    ])
      .then(() => done())
      .catch(done);
  });
  describe('POST: /api/profile/:profileId/company', function () {
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
    it('should return an event with a valid body and token', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/event`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .send(exampleEvent)
        .end((err, res) => {
          // console.log(exampleEvent);
          // console.log(res.body);
          // console.log(this.tempProfile._id);
          // console.log(this.tempCompany._id);
          expect(res.status).toEqual(200);
          expect(res.body.eventTitle).toEqual(exampleEvent.eventTitle);
          expect(res.body.eventType).toEqual(exampleEvent.eventType);
          expect(res.body.profileId).toEqual(this.tempProfile._id.toString());
          expect(res.body.userId).toEqual(this.tempUser._id.toString());
          done();
        });
    });
    it('should return 401 status without valid token', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/event`)
        .send(exampleEvent)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });
    it('should return a 400 error without valid body', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/event`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(400);
          done();
        });
    });
    it('should give an error with a wrong profileId but correct companyId', done => {
      request.post(`${url}/api/profile/1234/company/${this.tempCompany._id}/event`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(400);
          done();
        });
    });
  });
  describe('GET: /api/profile/:profileId/company/:companyId/event/:eventId', function () {
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
      exampleEvent.userId = this.tempUser._id.toString();
      exampleEvent.profileId = this.tempProfile._id.toString();
      exampleEvent.companyId = this.tempCompany._id.toString();
      new Event(exampleEvent).save()
        .then( event => {
          this.tempEvent = event;
          this.tempCompany.events.push(this.tempEvent._id);
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
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/event/${this.tempEvent._id}`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          // console.log(exampleEvent);
          // console.log(res.body);
          // console.log(this.tempProfile._id);
          // console.log(this.tempCompany);
          
          expect(res.status).toEqual(200);
          expect(res.body.eventTitle).toEqual(exampleEvent.eventTitle);
          expect(res.body.eventType).toEqual(exampleEvent.eventType);
          expect(res.body.profileId).toEqual(this.tempProfile._id.toString());
          expect(res.body.userId).toEqual(this.tempUser._id.toString());
          done();
        });
    });
    it('should return a 404 error when submitted with invalid id', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/event/1234`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
    it('should give 401 error when sent without token', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/event/${this.tempEvent._id}`)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });
  });
  describe('PUT: /api/profile/:profileId/company/:companyId/event/:eventId', function () {
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
    beforeAll(done => {
      exampleEvent.userId = this.tempUser._id.toString();
      exampleEvent.profileId = this.tempProfile._id.toString();
      exampleEvent.companyId = this.tempCompany._id.toString();
      new Event(exampleEvent).save()
        .then(event => {
          this.tempEvent = event;
          this.tempCompany.events.push(this.tempEvent._id);
          return this.tempCompany.save();
        })
        .then(company => {
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
      let updatedEvent = { eventTitle: 'drinks' };
      request.put(`${url}/api/profile/${this.tempCompany.profileId}/company/${this.tempCompany._id}/event/${this.tempEvent._id}`)
        .send(updatedEvent)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.eventTitle).toEqual(updatedEvent.eventTitle);
          expect(res.body.eventType).toEqual(exampleEvent.eventType);
          expect(res.body.profileId).toEqual(this.tempProfile._id.toString());
          expect(res.body.userId).toEqual(this.tempUser._id.toString());
          expect(this.tempCompany.events).toContain(res.body._id);
          done();
        });
    });
    it('should return a 404 error when submitted without id', done => {
      let updatedEvent = { eventTitle: 'drinks' };
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/event/1234`)
        .send(updatedEvent)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
    it('should give 401 error when sent without token', done => {
      let updatedEvent = { eventTitle: 'drinks' };
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/event/${this.tempEvent._id}`)
        .send(updatedEvent)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });
    it('should return a 400 error', done => {
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/event/${this.tempEvent._id}`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(400);
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
    beforeAll(done => {
      exampleEvent.userId = this.tempUser._id.toString();
      exampleEvent.profileId = this.tempProfile._id.toString();
      exampleEvent.companyId = this.tempCompany._id.toString();
      new Event(exampleEvent).save()
        .then(event => {
          this.tempEvent = event;
          this.tempCompany.events.push(this.tempEvent._id);
          return this.tempCompany.save();
        })
        .then(company => {
          this.tempCompany = company;
          done();
        })
        .catch(done);
    });
    it('should delete a Event with a valid token and data', done => {
      request.delete(`${url}/api/profile/${this.tempCompany.profileId}/company/${this.tempCompany._id}/event/${this.tempEvent._id}`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(204);
          expect(typeof res.body).toEqual('object');
          done();
        });
    });
  });
});