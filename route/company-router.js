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

  Profile.findById(req.params.profileId)
    .then( () => {
      let companyData = {
        companyName: req.body.companyName,
        website: req.body.website,
        userId: req.user._id,
        profileId: req.params.profileId,
        streetAddress: req.body.streetAddress || null,
        city: req.body.city || null,
        state: req.body.state || null,
        zip: req.body.zip || null,
        phone: req.body.phone || null,
        companyNotes: req.body.companyNotes || null,
      };
      return new Company(companyData).save();
    })
    // .populate('company')
    .then( company => res.json(company))
    .catch(next);
});

companyRouter.put('/api/profile/:profileId/company/:companyId', bearerAuth, jsonParser, function(req, res, next){
  debug('PUT: /api/profile/:profileId/company/:companyId');
  Profile.findById(req.params.profileId)
    .populate('companies')
    .then( company => { if(req.params.companyId === company) return company;})
    // .then(Company.findByIdAndUpdate(req.params.companyId, req.body, {new:true}))
    .then(company => res.json(company))
    .catch(err => next(err));
});

companyRouter.get('/api/profile/:profileId/company/:companyId', bearerAuth, function(req, res, next){
  debug('GET: /api/profile/:profileId/company/:companyId');

  Profile.findById(req.params.profileId)
    .populate('companies')
    .then(company => { if (req.params.companyId === company) return company; })
    // .then(Company.findById(req.params.companyId))
    .then(company => res.json(company))
    .catch(err => next(err));
});

companyRouter.delete('/api/profile/:profileId/company/:companyId', bearerAuth, function(req, res, next){
  debug('DELETE: /api/profile/:profileId/company/:companyId');
  Profile.findById(req.params.profileId)
    .then(Company.findByIdAndRemove(req.params.companyId, bearerAuth))
    .then( () => res.send(204))
    .catch(err => next(err));
});
