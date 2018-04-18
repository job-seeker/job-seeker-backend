'use strict';

const debug = require('debug')('job-seeker:company');
const Job = require('./job.js');
const Contact = require('./contact.js');
const Event = require('./event.js');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = Schema({
  companyName: { type: String, required: true },
  website: { type: String, required: true },
  cityState: { type: String },
  // state: { type: String },
  streetAddress: { type: String },
  zip: { type: String },
  phone: { type: String },
  companyNotes: { type: String },
  contacts: [{ type: Schema.Types.ObjectId, ref: 'contact' }],
  jobPosting: [{ type: Schema.Types.ObjectId, ref: 'job' }],
  events: [{ type: Schema.Types.ObjectId, ref: 'event' }],
  userId: { type: Schema.Types.ObjectId, required: true },
  profileId: { type: Schema.Types.ObjectId, required: true },
  created: { type: Date, default: Date.now },
});

const Company = module.exports = mongoose.model('company', companySchema);

Company.findByIdAndAddJob = function(id, job) {
  debug('findByIdAndAddJob');
  
  console.log(id)
  console.log(job)
  
  return Company.findById(id)
    .then( company => {
      job.userId = company.userId;
      job.profileId = company.profileId;
      job.companyId = company._id;
      this.tempCompany = company;
      return new Job(job).save();
    })
    .then( job => {
      this.tempCompany.jobPosting.push(job._id);
      this.tempJob = job;
      return this.tempCompany.save();
    })
    .then( () => {
      return this.tempJob;
    });
};

Company.findByIdAndRemoveJob = function(companyId, jobId){
  debug('findByIdAndRemoveJob');

  return Company.findById(companyId)
    .then(company => {
      for(let i = 0; i < company.jobPosting.length; i++){
        if(company.jobPosting[i].toString() === jobId){
          company.jobPosting.splice(i,1);
          return company.save();
        }
      }
    });
};
          
Company.findByIdAndAddContact = function(id, contact) {
  debug('findByIdAndAddContact');
  
  return Company.findById(id)
    .then( company => {
      contact.userId = company.userId;
      contact.profileId = company.profileId;
      contact.companyId = company._id;
      this.tempCompany = company;
      return new Contact(contact).save();
    })
    .then( contact => {
      this.tempCompany.contacts.push(contact._id);
      this.tempContact = contact;
      return this.tempCompany.save();
    })
    .then( () => {
      return this.tempContact;
    });
};

Company.findByIdAndAddEvent = function(id, event) {
  debug('findByIdAndAddEvent');
  
  return Company.findById(id)
    .then( company => {
      event.userId = company.userId;
      event.profileId = company.profileId;
      event.companyId = company._id;
      this.tempCompany = company;
      return new Event(event).save();
    })
    .then( event => {
      this.tempCompany.events.push(event._id);
      this.tempEvent = event;
      return this.tempCompany.save();
    })
    .then( () => {
      return this.tempEvent;
    });
};

Company.findByIdAndRemoveEvent = function (companyId, eventId) {
  debug('findByIdAndRemoveEvent');

  return Company.findById(companyId)
    .then(company => {
      for (let i = 0; i < company.events.length; i++) {
        if (company.events[i].toString() === eventId) {
          company.events.splice(i, 1);
          return company.save();
        }
      }
    });
};

Company.findByIdAndRemoveContact = function(companyId, contactId) {
  debug('findByIdAndRemoveContact');

  return Company.findById(companyId)
    .then(company => {
      for (let i = 0; i < company.contacts.length; i ++) {
        if (company.contacts[i].toString() === contactId) {
          company.contacts.splice(i, 1);
          return company.save();
        }
      }
    });
};