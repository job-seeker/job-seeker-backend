'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('job-seeker:contact-router');


const Company = require('../model/company.js');
const Contact = require('../model/contact.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const contactRouter = module.exports = Router();

contactRouter.post('/api/profile/:profileId/company/:companyId/contact', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/profile/:profileId/company/:companyId/contact');
  if(!req.body.name) return next(createError(400, 'bad request'));

  Company.findByIdAndAddContact(req.params.companyId, req.body)
    .then( contact => {
      if ((req.params.profileId === contact.profileId.toString()) && (req.params.companyId === contact.companyId.toString())) res.json(contact);
    })
    .catch(next);
});

contactRouter.get('/api/profile/:profileId/company/:companyId/contact/:contactId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId/contact/:contactId');
  
  Contact.findById(req.params.contactId)
    .then(contact => {
      if ((req.params.profileId === contact.profileId.toString()) && (req.params.companyId === contact.companyId.toString())) res.json(contact);
    })
    .catch(err => {
      createError(404, err.message);
      next();
    });

});

contactRouter.put('/api/profile/:profileId/company/:companyId/contact/:contactId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/profile/:profileId/company/:companyId/contact/:contactId');
  if (!req.body.name) return next(createError(400, 'bad request'));

  Contact.findByIdAndUpdate(req.params.contactId, req.body, { new: true })
    .then(contact => {
      if ((req.params.profileId === contact.profileId.toString()) && (req.params.companyId === contact.companyId.toString())) res.json(contact);
    })
    .catch(err => {
      createError(404, err.message);
      next();
    });

});

contactRouter.delete('/api/profile/:profileId/company/:companyId/contact/:contactId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/profile/:profileId/company/:companyId/contact/:contactId');

  Company.findByIdAndRemoveContact(req.params.companyId, req.params.contactId)
    .then(company => {
      return company;
    })
    .then(() => {
      return Contact.findByIdAndRemove(req.params.contactId);
    })
    .then(() => {
      return res.sendStatus(204);
    })
    .catch(next);

});