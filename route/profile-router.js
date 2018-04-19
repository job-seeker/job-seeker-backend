'use strict';

const Router = require('express').Router;
const jsonParser = require('body-parser').json();
const createError = require('http-errors');
const debug = require('debug')('job-seeker: profile-router');
const Profile = require('../model/profile.js');
const bearerAuth = require('../lib/bearer-auth-middleware.js');

const profileRouter = module.exports = Router();

profileRouter.post('/api/profile', bearerAuth, jsonParser, function(req, res, next) {
  debug('POST: /api/profile');
  if(!req.body.name) return next(createError(400, 'bad request'));
  if(!req.body.email) return next(createError(400, 'bad request'));

  req.body.userId = req.user._id;
  new Profile(req.body).save()
    .then( profile => res.json(profile))
    .catch(next);
});

profileRouter.get('/api/profile/', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/');

  Profile.findOne({ userId: req.user._id })
    .populate({
      path: 'companies',
      populate: [
        { path: 'jobPosting' },
        { path: 'events' },
        { path: 'contacts' },
      ],
    })
    .then( profile => res.json(profile))
    .catch(next);
});


profileRouter.get('/api/profile/:profileId', bearerAuth, function(req, res, next) {
  debug('GET: /api/profile/:profileId');

  Profile.findById(req.params.profileId)
    .then( profile => res.json(profile))
    .catch(next);
});

profileRouter.delete('/api/profile/:profileId', bearerAuth, function(req, res, next) {
  debug('DELETE: /api/profile');
  Profile.findByIdAndRemove(req.params.profileId)
    .then( () => res.send(204))
    .catch(next);
});

profileRouter.put('/api/profile/:profileId', bearerAuth, jsonParser, function(req, res, next) {
  debug('PUT: /api/profile/:profileId');

  if(Object.keys(req.body).length === 0) return next(createError(400, 'bad request'));

  Profile.findByIdAndUpdate(req.params.profileId, req.body, { new: true })
    .then( profile => res.json(profile))
    .catch(next);
});