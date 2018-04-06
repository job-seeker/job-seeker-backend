'use strict';

// REVIEW: basic auth middleware looks as expected
const createError = require('http-errors');
const debug = require('debug')('job-seeker:basic-auth');

module.exports = function(req, res, next) {
  debug('basic auth');
  
  var authHeader = req.headers.authorization;
  if (!authHeader) return next(createError(401, 'authorization header required'));


  var base64str = authHeader.split('Basic ')[1];
  if (!base64str) return next(createError(401, 'username and password required'));

  var utf8str = Buffer.from(base64str, 'base64').toString();
  var authArray = utf8str.split(':');

  req.auth = {
    username: authArray[0],
    password: authArray[1],
  };

  if (!req.auth.username) return next(createError(401, 'username required'));
  if (!req.auth.password) return next(createError(401, 'password required'));

  next();
};