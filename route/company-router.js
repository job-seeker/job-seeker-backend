'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('job-seeker: company-router');

const Profile = require('../model/profile.js');
const Company = require('../model/company.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const companyRouter = module.exports = Router();

companyRouter.post('/api/profile/:profileId/company', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/profile/:profileId/company');
  if(!req.body.companyName) return next(createError(400, 'bad request'));

  Profile.findByIdAndAddCompany(req.params.profileId, req.body)
    .then( company => {
      if (req.params.profileId === company.profileId.toString()) res.json(company);
    })
    .catch(next);
});

companyRouter.put('/api/profile/:profileId/company/:companyId', bearerAuth, jsonParser, function(req, res, next){
  debug('PUT: /api/profile/:profileId/company/:companyId');
  Company.findByIdAndUpdate(req.params.companyId, req.body, {new:true})
    .then( company => { 
      if(req.params.profileId === company.profileId.toString()){
        return res.json(company);
      }
    })
    .catch(err => next(err));
});

companyRouter.get('/api/profile/:profileId/company/:companyId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId');
  
  Company.findById(req.params.companyId)
    .then(company => { 
      console.log(typeof req.params.profileId);
      console.log(typeof company.profileId);
      if (req.params.profileId === company.profileId.toString()) { 
        return res.json(company);
      }
    })
    .catch(next);
  
});

// companyRouter.delete('/api/profile/:profileId/company/:companyId', bearerAuth, function(req, res, next){
//   debug('DELETE: /api/profile/:profileId/company/:companyId');
//   Company.findById(req.params.companyId)
//     .then(company => {
//       if (req.params.profileId === company.profileId.toString()) { 

//   Company.findByIdAndRemove(req.params.companyId, bearerAuth)
//     .then(company => { 
//       if (req.params.profileId === company.profileId.toString()) { 
//         return res.send(204);
//       }
//     })
//     .catch(next);

//////make delete method on profile that removes from companies array
// });
