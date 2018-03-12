'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = Schema({
  name: { type: String, required: true },
  jobTitle: { type: String },
  email: { type: String },
  phone: { type: String },
  linkedIn: { type: String },
  notes: { type: String },
  userId: { type: Schema.Types.ObjectId, required: true },
  profileId: { type: Schema.Types.ObjectId, required: true },
  companyId: { type: Schema.Types.ObjectId, required: true },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('contact', contactSchema);