'use strict';

const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const debug = require('debug')('job-seeker:bearer-auth');

const User = require('../model/user');

module.exports = function(req, res, next) {
  debug('bearer auth');

  var authHeader = req.headers.authorization;
  if (!authHeader) return next(createError(401, 'auth header required'));

  var token = authHeader.split('Bearer ')[1];
  if (!token) return next(createError(401, 'token required'));

  jwt.verify(token, process.env.APP_SECRET, (err, decoded) => {
    if (err) return next(err);
    User.findOne( { findHash: decoded.token } )
      .then( user => {
        req.user = user;
        next();
      })
      .catch(next);
  });
};