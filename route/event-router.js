'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const debug = require('debug')('job-seeker:event-router');

const Company = require('../model/company.js');
const Event = require('../model/event.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const eventRouter = module.exports = Router();

eventRouter.post('/api/profile/:profileId/company/:companyId/event', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/profile/:profileId/company/:companyId/event');

  Company.findByIdAndAddEvent(req.params.companyId, req.body)
    .then( event => {
      if ((req.params.profileId === event.profileId.toString()) && (req.params.companyId === event.companyId.toString())) res.json(event);
    })
    .catch(next);
});

eventRouter.get('/api/profile/:profileId/company/:companyId/event/:eventId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId/event/:eventId');
  
  Event.findById(req.params.eventId)
    .then(event => {
      if ((req.params.profileId === event.profileId.toString()) && (req.params.companyId === event.companyId.toString())) res.json(event);
    })
    .catch(next);
});

// GET all events associated with a profile
eventRouter.get('/api/profile/:profileId/allProfileEvents', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/allProfileEvents');

  Event.find({ 'profileId':req.params.profileId })
    .populate({
      path: 'company',
      populate: {
        path: 'profile',
        model: 'profile',
      },
    })
    .then( events => {
      return res.json(events);
    })
    .catch(next);
});

// GET all events associated with a company
eventRouter.get('/api/profile/:profileId/company/:companyId/allCompanyEvents', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId/allCompanyEvents');

  Event.find({ 'companyId':req.params.companyId })
    .populate('companies')
    .then( events => {
      return res.json(events);
    })
    .catch(next);
});

eventRouter.put('/api/profile/:profileId/company/:companyId/event/:eventId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/profile/:profileId/company/:companyId/event/:eventId');

  Event.findByIdAndUpdate(req.params.eventId, req.body, { new: true })
    .then(event => {
      if ((req.params.profileId === event.profileId.toString()) && (req.params.companyId === event.companyId.toString())) res.json(event);
    })
    .catch(next);

});

eventRouter.delete('/api/profile/:profileId/company/:companyId/event/:eventId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/profile/:profileId/company/:companyId/event/:eventId');

  Company.findByIdAndRemoveEvent(req.params.companyId, req.params.eventId)
    .then(company => {
      return company;
    })
    .then(() => {
      return Event.findByIdAndRemove(req.params.eventId);
    })
    .then(() => {
      return res.sendStatus(204);
    })
    .catch(next);

});