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

  // REVIEW: excellent usage of a custom resource method to populate a company
  Profile.findByIdAndAddCompany(req.params.profileId, req.body)
    .then( company => {
      if (req.params.profileId === company.profileId.toString()) res.json(company);
    })
    .catch(next);
});

companyRouter.put('/api/profile/:profileId/company/:companyId', bearerAuth, jsonParser, function(req, res, next){
  debug('PUT: /api/profile/:profileId/company/:companyId');
  if (!req.body.companyName) return next(createError(400, 'bad request'));
  Company.findByIdAndUpdate(req.params.companyId, req.body, {new:true})
    .then( company => { 
      if(req.params.profileId === company.profileId.toString()){
        return res.json(company);
      }
    })
    .catch(err => {
      // REVIEW: why are you calling next() without an argument here?
      // directly passing the error through to your error handling middleware is a better practice
      // note: same comment goes for all instances of this within this file
      createError(404, err.message);
      next();
    });
});

companyRouter.get('/api/profile/:profileId/company/:companyId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId');
  
  Company.findById(req.params.companyId)
    .then(company => { 
      if (req.params.profileId === company.profileId.toString()) { 
        return res.json(company);
      }
    })
    .catch( err => {
      createError(404, err.message);
      next();
    });
});

companyRouter.get('/api/profile/:profileId/company', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company');

  Profile.findById(req.params.profileId)
    .populate('companies')
    .then( companies => {
      return res.json(companies);
    })
    .catch(err => next(createError(404, err.message)));
});

companyRouter.delete('/api/profile/:profileId/company/:companyId', bearerAuth, function(req, res, next){
  debug('DELETE: /api/profile/:profileId/company/:companyId');

  Profile.findByIdAndRemoveCompany(req.params.profileId, req.params.companyId)
    // REVIEW: nice job using chained then blocks to pass values down until the final action is completed
    // that said, there isn't a need for the return res.sendStatus to be by itself - you could just send the status before
    // returning Company.findByIdAndRemove...
    .then( profile => {
      return profile;
    })
    .then( () => {
      return Company.findByIdAndRemove(req.params.companyId);
    })
    .then( () => {
      return res.sendStatus(204);
    })
    .catch(next);
});