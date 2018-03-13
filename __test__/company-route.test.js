'use strict';

const request = require('superagent');
const serverToggle = require('../lib/server-toggle.js');
const server = require('../server.js');
const PORT = process.env.PORT || 3000;

const User = require('../model/user.js');
const Profile = require('../model/profile.js');
const Company = require('../model/company.js');
const exampleUser = require('./lib/mock-user.js');

const url = `http://localhost:${PORT}`;

require('jest');


const exampleProfile = {
  name: 'example name',
  email: exampleUser.email,
};

const exampleCompany = {
  companyName: 'FakeBook',
  website: 'www.fakebook.com',
};

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
      afterAll( done => {
        delete exampleProfile.userId;
        done();
      });
      it.only('should return a company', done => {
        
        request.post(`${url}/api/profile/${this.tempProfile._id}/company`)
          .set({ Authorization: `Bearer ${this.tempToken}`})
          .send(exampleCompany)
          .end((err, res) => {
            
            
            expect(res.status).toEqual(200);
            done();
          });
      });


//     });
//     describe('without valid token', function() {
//       beforeAll(done => {
//         new User(exampleUser)
//           .generatePasswordHash(exampleUser.password)
//           .then(user => user.save())
//           .then(user => {
//             this.tempUser = user;
//             return user.generateToken();
//           })
//           .then(token => {
//             this.tempToken = token;
//             done();
//           })
//           .catch(done);
//       });
//       beforeAll(done => {
//         exampleProfile.userId = this.tempUser._id.toString();
//         new Profile(exampleProfile).save()
//           .then(profile => {
//             this.tempProfile = profile;
//             done();
//           })
//           .catch(done);
//       });
//       afterAll(done => {
//         delete exampleProfile.userId;
//         done();
//       });
//       it('should return 401 status', done => {
//         request.post(`${url}/api/profile/${this.tempProfile._id}/company`)
//           .send(exampleCompany)
//           .end((err, res) => {
//             expect(res.status).toEqual(401);
//             done();
//           });
//       });
//     });
//     describe('without valid body', function() {
//       beforeAll(done => {
//         new User(exampleUser)
//           .generatePasswordHash(exampleUser.password)
//           .then(user => user.save())
//           .then(user => {
//             this.tempUser = user;
//             return user.generateToken();
//           })
//           .then(token => {
//             this.tempToken = token;
//             done();
//           })
//           .catch(done);
//       });
//       beforeAll(done => {
//         exampleProfile.userId = this.tempUser._id.toString();
//         new Profile(exampleProfile).save()
//           .then(profile => {
//             this.tempProfile = profile;
//             done();
//           })
//           .catch(done);
//       });
//       afterAll(done => {
//         delete exampleProfile.userId;
//         done();
//       });
//       it('should return a 400 error', done => {
//         request.post(`${url}/api/profile/${this.tempProfile._id}/company`)
//           .set({ Authorization: `Bearer ${this.tempToken}` })
//           .end((err, res) => {
//             expect(res.status).toEqual(400);
//             done();
//           });
//       });
//     });
//   });
//   describe('GET: /api/profile/:profileId/company/:companyId', function() {
//     beforeAll(done => {
//       new User(exampleUser)
//         .generatePasswordHash(exampleUser.password)
//         .then(user => user.save())
//         .then(user => {
//           this.tempUser = user;
//           return user.generateToken();
//         })
//         .then(token => {
//           this.tempToken = token;
//           done();
//         })
//         .catch(done);
//     });
//     beforeAll(done => {
//       exampleProfile.userId = this.tempUser._id.toString();
//       new Profile(exampleProfile).save()
//         .then(profile => {
//           this.tempProfile = profile;
//           done();
//         })
//         .catch(done);
//     });
//     beforeAll( done => {
//       exampleCompany.userId = this.tempUser._id.toString();
//       exampleCompany.profileId = this.tempProfile._id.toString();
//       new Company(exampleCompany).save()
//         .then( company => {
//           this.tempCompany = company;
//           done();
//         })
//         .catch(done);
//     });
//     afterAll(done => {
//       delete exampleProfile.userId;
//       done();
//     });
//     it('should return a company when provided valid token and body', done => {
//       request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}`)
//         .set({ Authorization: `Bearer ${this.tempToken}` })
//         .end((err, res) => {
//           console.log('get res', res.body)
//           expect(res.status).toEqual(200);
//           done();
//         });
//     });
//     it('should return a 404 error when submitted without id', done => {
//       request.get(`${url}/api/profile/${this.tempProfile._id}/company`)
//         .set({ Authorization: `Bearer ${this.tempToken}` })
//         .end((err, res) => {
//           expect(res.status).toEqual(404);
//           done();
//         });
//     });
//     it('should give 401 error when sent without token', done => {
//       request.get(`${url}/api/profile/${this.tempProfile._id}/company/${this.tempCompany._id}`)
//         .end((err, res) => {
//           expect(res.status).toEqual(401);
//           done();
//         });
//     });
//   });
//   describe('PUT: /api/profile/:profileId/company/:companyId', function () {
//     beforeAll(done => {
//       new User(exampleUser)
//         .generatePasswordHash(exampleUser.password)
//         .then(user => user.save())
//         .then(user => {
//           this.tempUser = user;
//           return user.generateToken();
//         })
//         .then(token => {
//           this.tempToken = token;
//           done();
//         })
//         .catch(done);
//     });
//     beforeAll(done => {
//       exampleProfile.userId = this.tempUser._id.toString();
//       new Profile(exampleProfile).save()
//         .then(profile => {
//           this.tempProfile = profile;
//           done();
//         })
//         .catch(done);
//     });
//     beforeAll(done => {
//       exampleCompany.userId = this.tempUser._id.toString();
//       exampleCompany.profileId = this.tempProfile._id.toString();
//       new Company(exampleCompany).save()
//         .then(company => {
//           this.tempCompany = company;
//           done();
//           console.log('tempcomp', company)
//         })
//         .catch(done);
//     });
//     afterAll(done => {
//       delete exampleProfile.userId;
//       done();
//     });
//     it('should return an updated company when provided valid token and body', done => {
//       let updatedCompany = { companyName: 'FaceLook'};
//       request.put(`${url}/api/profile/${this.tempCompany.profileId}/company/${this.tempCompany._id}`)
//         .send(updatedCompany)
//         .set({ Authorization: `Bearer ${this.tempToken}` })
//         .end((err, res) => {
//           console.log(res.body)
//           expect(res.status).toEqual(200);
//           expect(res.body.companyName).toEqual(updatedCompany.companyName);
//           expect(res.body.website).toEqual(exampleCompany.website);
//           done();
//         });
    
    });
  
  });
  
});