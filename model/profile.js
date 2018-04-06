'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Company = require('./company.js');
const debug = require('debug')('job-seeker:profile');

// REVIEW: model properties look good - nice job adding a "ref" to the company model
const profileSchema = Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  companies: [{ type: Schema.Types.ObjectId, ref: 'company' }],
  userId: { type: Schema.Types.ObjectId, required: true },
});

const Profile = module.exports = mongoose.model('profile', profileSchema);

// REVIEW: nice passing of data through then() blocks
Profile.findByIdAndAddCompany = function(id, company) {
  debug('findByIdAndAddCompany');
  return Profile.findById(id)
    .then(profile => {
      company.profileId = profile._id;
      company.userId = profile.userId;
      this.tempProfile = profile;
      return new Company(company).save();
    })
    .then(company => {
      this.tempProfile.companies.push(company._id);
      this.tempCompany = company;
      return this.tempProfile.save();
    })
    .then(() => {
      return this.tempCompany;
    });
};

Profile.findByIdAndRemoveCompany = function(profileId, companyId) {
  debug('findByIdAndRemoveCompany');

  return Profile.findById(profileId)
    .then( profile => {
      for (let i = 0; i < profile.companies.length; i++) {
        if (profile.companies[i].toString() === companyId) {
          profile.companies.splice(i, 1);
          return profile.save();
        }
      }
    });
};