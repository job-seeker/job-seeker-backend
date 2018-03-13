'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('job-seeker:contact-router');

const Profile = require('../model/profile');
const Company = require('../model/company');
const Contact = require('../model/contact');
const bearerAuth = require('../lib/bearer-auth-middleware');

const eventRouter = module.exports = Router();

eventRouter.post('/api/profile/:profileId/company/:companyId/event', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/profile/:profileId/company/:companyId/event');

  Company.findByIdAndAddEvent(req.params.companyId, req.body)
    .then( event => res.json(event))
    .catch(next);
});

eventRouter.get('/api/profile/:profileId/company/:companyId/event/:eventId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId/event/:eventId');


});

eventRouter.put('/api/profile/:profileId/company/:companyId/event/:eventId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/profile/:profileId/company/:companyId/event/:eventId');


});

eventRouter.delete('/api/profile/:profileId/company/:companyId/event/:eventId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/profile/:profileId/company/:companyId/event/:eventId');


});