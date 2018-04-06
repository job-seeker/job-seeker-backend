'use strict';

// REVIEW: server toggler looks good but your serverOn method is commented out
// is this due to concurrent test issue?  why is this the case?
const debug = require('debug')('job-seeker:server-toggle');
const mongoose = require('mongoose');

module.exports = exports = {};

exports.serverOn = function(server, done) {
  // if (!server.isRunning) {
  //   server.listen(process.env.PORT, () => {
  //     server.isRunning = true;
  //     debug('server up');
  //     done();
  //   });
  //   return;
  // }
  done();
};

exports.serverOff = function(server, done) {
  if (server.isRunning) {
    server.close( err => {
      if (err) return done(err);
      server.isRunning = false;
      mongoose.connection.close();
      debug('server down');
      done();
    });
    return;
  }
  // done();
};