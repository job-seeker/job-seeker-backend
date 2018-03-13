'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('job-seeker:job-router');

const Profile = require('../model/profile.js');
const Company = require('../model/company.js');
const Job = require('../model/job.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const jobRouter = module.exports = Router();

jobRouter.post('/api/profile/:profileId/company/:companyId/job', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/profile/:profileId/company/:companyId/job');
  
  Profile.findById(req.params.profileId)
    .then( profile => {
      if (req.params.profileId === profile._id.toString()) {
        profile.companies.push(req.params.companyId); // temporary - should be in company router
        return profile;
      }
    })
    .then( () => { 
      return Company.findById(req.params.companyId);
    })
    .then( company => {
      let jobData = {
        title: req.body.title,
        link: req.body.link,
        status: req.body.status,
        type: req.body.type,
        notes: req.body.notes || null,
        tags: req.body.tags || null,
        userId: company.userId,
        profileId: company.profileId,
        companyId: company._id,
      };
      let newJob = new Job(jobData);
      company.jobPosting.push(newJob._id); // rename jobPosting
      return newJob.save();
    })
    .then( job => res.json(job))
    .catch( err => next(err));
});

jobRouter.put('/api/profile/:profileId/company/:companyId/job/:jobId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/profile/:profileId/company/:companyId/job/:jobId');

  // insert route here
});

jobRouter.get('/api/profile/:profileId/company/:companyId/job/:jobId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId/job/:jobId');

  // insert route here
});

jobRouter.delete('/api/profile/:profileId/company/:companyId/job', bearerAuth, jsonParser, function(req, res, next) {
  debug('DELETE: /api/profile/:profileId/company/:companyId/job/:jobId');

  // insert route here
});