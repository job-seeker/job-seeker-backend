'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('job-seeker: user-router');
const Router = require('express').Router;
const basicAuth = require('../lib/basic-auth-middleware.js');
const User = require('../model/user.js');
const createError = require('http-errors');

const userRouter = module.exports = Router();

// REVIEW: user and auth related functionality look great - no concerns here
userRouter.post('/api/signup', jsonParser, function(req, res, next) {
  debug('POST: /api/signup');
  if(!req.body.username) return next(createError(400, 'ValidationError'));

  let password = req.body.password;
  delete req.body.password;

  let user = new User(req.body);
  user.generatePasswordHash(password)
    .then( user => user.save())
    .then( user => user.generateToken())
    .then( token => res.send(token))
    .catch(next);
});

userRouter.get('/api/signin', basicAuth, function(req, res, next) {
  debug('GET: /api/signin');

  User.findOne({ username: req.auth.username })
    .then( user => user.comparePasswordHash(req.auth.password))
    .then( user => user.generateToken())
    .then( token => res.send(token))
    .catch(next);
});