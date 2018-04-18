'use strict';

const createError = require('http-errors');
const debug = require('debug')('job-seeker:errors');

module.exports = function (err, req, res, next) {
  debug('error middleware');

  if (err.status) {
    res.status(err.status).send(err.name);
    next();
    return;
  }
  if (err.name === 'CastError') {
    err = createError(404, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }
  if (err.name === 'TypeError') {
    err = createError(400, err.message);
    res.status(err.status).send(err.name);
    next();
    return;
  }
};