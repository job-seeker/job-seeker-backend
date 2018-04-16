'use strict';

const jsonParser = require('body-parser').json();
const debug = require('debug')('job-seeker: user-router');
const Router = require('express').Router;
const User = require('../model/user.js');

const userRouter = module.exports = Router();

userRouter.post('/api/handleAuth', jsonParser, function (req, res, next) {
  debug('GET: /api/handleAuth');

  User.findOne({ email: req.body.email })
    .then(user => user ? user : new User(req.body).save())
    .then(user => user.generateToken())
    .then(token => res.send(token))
    .catch(next);
});
