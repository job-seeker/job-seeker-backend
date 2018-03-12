'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const companySchema = Schema({
  companyName: { type: String, required: true },
  website: { type: String, required: true },
  streetAddress: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  phone: { type: String },
  companyNotes: { type: String },
  contacts: { type: Array, default: [] },
  jobPosting: { type: Array, default: [] },
  events: { type: Array, default: [] },
  userId: { type: Schema.Types.ObjectId, required: true },
  profileId: { type: Schema.Types.ObjectId, required: true },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('company', companySchema);