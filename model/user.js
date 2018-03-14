'use strict';

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const createError = require('http-errors');
const debug = require('debug')('job-seeker:user');

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  findHash : { type: String, unique: true },
});

userSchema.methods.generatePasswordHash = function(password) {
  debug('Password Hashing');

  return new Promise((resolve, reject) => {
    // bcrypt.hash takes a password, salt level, and a callback function that takes err, hash(hash being the hashed password we just worked with)
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return reject(err);
      // sets the hashed password equal to the object's password property, resolve promise
      this.password = hash;
      resolve(this);
    });
  });
};

userSchema.methods.comparePasswordHash = function(password) {
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
    let tries = 0;

    _generateFindHash.call(this);

    function _generateFindHash() {
      this.findHash = crypto.randomBytes(32).toString('hex');
      this.save()
        .then ( () => resolve(this.findHash))
        .catch( err => {
          if (tries > 3) return reject(err);
          tries++;
          _generateFindHash.call(this);
        });
    }
  });
};

userSchema.methods.generateToken = function() {
  debug('generate token');

  return new Promise((resolve, reject) => {
    this.generateFindHash()
      .then( findHash => resolve(jwt.sign({ token: findHash }, process.env.APP_SECRET)))
      .catch( err => reject(err));
  });
};

module.exports = mongoose.model('user', userSchema);