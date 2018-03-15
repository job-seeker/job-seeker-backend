'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('job-seeker:job-router');

const Company = require('../model/company.js');
const Job = require('../model/job.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const jobRouter = module.exports = Router();

jobRouter.post('/api/profile/:profileId/company/:companyId/job', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/profile/:profileId/company/:companyId/job');
  
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

  Job.findByIdAndUpdate(req.params.jobId, req.body, {new:true})
    .then( job =>{
      if((req.params.profileId === job.profileId.toString()) && (req.params.companyId === job.companyId.toString())){
        return res.json(job);
      }
    })
    .catch(next);
});

jobRouter.get('/api/profile/:profileId/company/:companyId/job/:jobId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId/job/:jobId');

  Job.findById(req.params.jobId)
    .then(job => {
      if((req.params.profileId === job.profileId.toString()) && (req.params.companyId === job.companyId.toString())){
        return res.json(job);
      }
    })
    .catch(next);
});

// GET all jobs associated with a profile
jobRouter.get('/api/profile/:profileId/allProfileJobs', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/allProfileJobs');

  Job.find({ 'profileId':req.params.profileId })
    .populate({
      path: 'company',
      populate: {
        path: 'profile',
        model: 'profile',
      },
    })
    .then( jobs => {
      return res.json(jobs);
    })
    .catch(next);
});

// GET all jobs associated with a company
jobRouter.get('/api/profile/:profileId/company/:companyId/allCompanyJobs', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId/allCompanyJobs');

  Job.find({ 'companyId':req.params.companyId })
    .populate('companies')
    .then( jobs => {
      return res.json(jobs);
    })
    .catch(next);
});

jobRouter.delete('/api/profile/:profileId/company/:companyId/job/:jobId', bearerAuth, jsonParser, function(req, res, next) {
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