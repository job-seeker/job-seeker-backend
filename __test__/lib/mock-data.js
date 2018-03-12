'use strict';

const faker = require('faker');

let exampleUser = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

let exampleProfile = {
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
};

let exampleContact = {
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  jobTitle: faker.name.jobTitle(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  linkedIn: faker.internet.url(),
};

let updatedProfile = {
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: faker.internet.email(),
};

module.exports = {
  'exampleUser': exampleUser,
  'exampleProfile': exampleProfile,
  'exampleContact': exampleContact,
  'updatedProfile': updatedProfile,
};