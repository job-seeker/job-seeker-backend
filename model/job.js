'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = Schema({
  title: { type: String, required: true },
  link: { type: String, required: true, unique: true },
  status: { type: String, required: true }, // validate on front end
  type: { type: String, required: true },
  notes: { type: String },
  tags: { type: Array, default: [] },
  userId: { type: Schema.Types.ObjectId, required: true },
  profileId: { type: Schema.Types.ObjectId, required: true },
  companyId: { type: Schema.Types.ObjectId, required: true },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('job', jobSchema);