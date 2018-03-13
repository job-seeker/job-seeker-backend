'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('job-seeker:contact-router');

const Profile = require('../model/profile');
const Company = require('../model/company');
const Contact = require('../model/contact');
const bearerAuth = require('../lib/bearer-auth-middleware');

const contactRouter = module.exports = Router();

contactRouter.post('/api/profile/:profileId/company/:companyId/contact', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/profile/:profileId/company/:companyId/contact');


});

contactRouter.get('/api/profile/:profileId/company/:companyId/contact/:contactId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId/company/:companyId/contact/:contactId');


});

contactRouter.put('/api/profile/:profileId/company/:companyId/contact/:contactId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/profile/:profileId/company/:companyId/contact/:contactId');


});

contactRouter.delete('/api/profile/:profileId/company/:companyId/contact/:contactId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/profile/:profileId/company/:companyId/contact/:contactId');


});