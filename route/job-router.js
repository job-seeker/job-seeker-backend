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

  // insert route here
});

jobRouter.put('/api/profile/:profileId/company/:companyId/job/:jobId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/profile/:profileId/company/:companyId/job/:jobId');

  // insert route here
});

jobRouter.get('/api/profile/:profileId/company/:companyId/job/:jobId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId/job/:jobId');

  // insert route here
});

jobRouter.DELETE('/api/profile/:profileId/company/:companyId/job', bearerAuth, jsonParser, function(req, res, next) {
  debug('DELETE: /api/profile/:profileId/company/:companyId/job/:jobId');

  // insert route here
});