'use strict';

const faker = require('faker');

let exampleUser = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

module.exports = exampleUser;