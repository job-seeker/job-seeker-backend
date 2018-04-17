'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('job-seeker:user');

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String},
  findHash: { type: String, unique: true },
});

userSchema.methods.generatePasswordHash = function(password) {
  debug('Password Hashing');

  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      this.password = hash;
      resolve(this);
    });
  });
};
userSchema.methods.comparePasswordHash = function (password) {
  debug('Compare Password hashes');

  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, valid) => {
      if (err) return reject(err);
      if (!valid) return reject(createError(401, 'invalid password'));
      resolve(this);
    });
  });
};

userSchema.methods.generateFindHash = function() {
  debug('Generate Find Hash');

  return new Promise((resolve, reject) => {
    _generateFindHash.call(this);

    function _generateFindHash() {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
        .then ( () => resolve(this.findHash))
        .catch(reject);
    }
  });
};

userSchema.methods.generateToken = function() {
  debug('generate token');

  return new Promise((resolve, reject) => {
    this.generateFindHash()
      .then( findHash => resolve(jwt.sign({ token: findHash }, process.env.APP_SECRET)))
      .catch(reject);
  });
};

module.exports = mongoose.model('user', userSchema);