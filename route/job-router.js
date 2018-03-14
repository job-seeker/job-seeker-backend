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
  if(!req.body.title) return next(createError(400, 'bad request'));
  
  Company.findByIdAndAddJob(req.params.companyId, req.body)
    .then( job => {
      if((req.params.profileId === job.profileId.toString()) && (req.params.companyId === job.companyId.toString())){
        return res.json(job);
      }
    })
    .catch(next); 
});

jobRouter.put('/api/profile/:profileId/company/:companyId/job/:jobId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/profile/:profileId/company/:companyId/job/:jobId');
  if(!req.body.title) return next(createError(400, 'bad request'));
  Job.findByIdAndUpdate(req.params.jobId, req.body, {new:true})
    .then( job =>{
      if((req.params.profileId === job.profileId.toString()) && (req.params.companyId === job.companyId.toString())){
        return res.json(job);
      }
    })
    .catch(err => {
      createError(404, err.message);
      next();
    });
});

jobRouter.get('/api/profile/:profileId/company/:companyId/job/:jobId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId/job/:jobId');

  Job.findById(req.params.jobId)
    .then(job => {
      if((req.params.profileId === job.profileId.toString()) && (req.params.companyId === job.companyId.toString())){
        return res.json(job);
      }
    })
    .catch(err => {
      createError(404, err.message);
      next();
    });
});

jobRouter.delete('/api/profile/:profileId/company/:companyId/job', bearerAuth, jsonParser, function(req, res, next) {
  debug('DELETE: /api/profile/:profileId/company/:companyId/job/:jobId');

  Company.findByIdAndRemoveJob(req.params.companyId, req.params.jobId)
    .then(company =>{
      return company;
    })
    .then( () => {
      return Job.findByIdAndRemove(req.params.jobId);
    })
    .then( () => {
      return res.sendStatus(204);
    })
    .catch(next);
});