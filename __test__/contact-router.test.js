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
  

    it('should return a 200 and a newly instantiated contact with a valid token and data', done => {
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
    it('should return a 401 error without a valid token', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact`)
        .send(exampleContact)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });
    it('should return a 400 error without sending a body', done => {
      request.post(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(400);
          done();
        });
    });
    it('should return a 404 error with an invalid request', done => {
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

  describe('GET: /api/profile/:profileId/company/:companyId/contact/:contactId', () => {
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
    beforeAll( done => {
      exampleContact.userId = this.tempUser._id.toString();
      exampleContact.profileId = this.tempProfile._id.toString();
      exampleContact.companyId = this.tempCompany._id.toString();
      new Contact(exampleContact).save()
        .then( contact => {
          this.tempContact = contact;
          this.tempCompany.contacts.push(this.tempContact._id);
          return this.tempCompany.save();
        })
        .then( company => {
          this.tempCompany = company;
          done();
        })
        .catch(done);
    });
    afterAll( done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return a contact with a valid request', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact/${this.tempContact._id}`)
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
    it('should return a 401 error without a token', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact/${this.tempContact._id}`)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });
    it('should return a 404 error with an invalid id', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact/1234`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
  });

  describe('GET: /api/profile/:profileId/allProfileContacts', function () {
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
      exampleContact.userId = this.tempUser._id.toString();
      exampleContact.profileId = this.tempProfile._id.toString();
      exampleContact.companyId = this.tempCompany._id.toString();
      new Contact(exampleContact).save()
        .then( contact => {
          this.tempContact = contact;
          this.tempCompany.contacts.push(this.tempContact._id);
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
    it('should return all of a profile\'s associated conttacts when provided valid token and body', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/allProfileContacts`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          console.log(res.body[0]);
          expect(res.body[0].name).toEqual(this.tempContact.name);
          expect(res.body[0].profileId).toEqual(this.tempProfile._id.toString());
          done();
        });
    });
    it('should return a 404 error when submitted with invalid id', done => {
      request.get(`${url}/api/profile/12345/allProfileContacts`)
        .set({ Authorization: `Bearer ${this.tempToken}` })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          expect(res.text).toEqual('NotFoundError');
          done();
        });
    });
    it('should give 401 error when sent without token', done => {
      request.get(`${url}/api/profile/${this.tempProfile._id}/allProfileContacts`)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          expect(res.text).toEqual('UnauthorizedError');
          done();
        });
    });
  });
  
  describe('PUT: /api/profile/:profileId/company/:companyId/contact/:contactId', () => {
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
    beforeAll( done => {
      exampleContact.userId = this.tempUser._id.toString();
      exampleContact.profileId = this.tempProfile._id.toString();
      exampleContact.companyId = this.tempCompany._id.toString();
      new Contact(exampleContact).save()
        .then( contact => {
          this.tempContact = contact;
          this.tempCompany.contacts.push(this.tempContact._id);
          return this.tempCompany.save();
        })
        .then( company => {
          this.tempCompany = company;
          done();
        })
        .catch(done);
    });
    afterAll( done => {
      delete exampleProfile.userId;
      done();
    });
    it('should return an updated contact object with a valid request', done => {
      let updatedContact = { name: 'updated name' };
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact/${this.tempContact._id}`)
        .send(updatedContact)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(200);
          expect(res.body.name).toEqual(updatedContact.name);
          expect(res.body.jobTitle).toEqual(exampleContact.jobTitle);
          expect(res.body.email).toEqual(exampleContact.email);
          expect(res.body.phone).toEqual(exampleContact.phone);
          expect(res.body.linkedIn).toEqual(exampleContact.linkedIn);
          done();
        });
    });
    it('should return a 404 without sending a valid id', done => {
      let updatedContact = { name: 'updated name' };
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact/1234`)
        .send(updatedContact)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(404);
          done();
        });
    });
    it('should return a 401 error without sending a token', done => {
      let updatedContact = { name: 'updated name' };
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact/${this.tempContact._id}`)
        .send(updatedContact)
        .end((err, res) => {
          expect(res.status).toEqual(401);
          done();
        });
    });
    it('should return a 400 error without sending a body', done => {
      request.put(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact/${this.tempContact._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(400);
          done();
        });
    });
  });

  describe('DELETE: /api/profile/:profileId/company/:companyId/contact/:contactId', () => {
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
    beforeAll( done => {
      exampleContact.userId = this.tempUser._id.toString();
      exampleContact.profileId = this.tempProfile._id.toString();
      exampleContact.companyId = this.tempCompany._id.toString();
      new Contact(exampleContact).save()
        .then( contact => {
          this.tempContact = contact;
          this.tempCompany.contacts.push(this.tempContact._id);
          return this.tempCompany.save();
        })
        .then( company => {
          this.tempCompany = company;
          done();
        })
        .catch(done);
    });
    it('should delete a company and return a 204 with a valid delete request', done => {
      request.delete(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}/contact/${this.tempContact._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).toEqual(204);
          expect(typeof res.body).toEqual('object');
          done();
        });
    });
  });
});
