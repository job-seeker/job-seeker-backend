'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = Schema({
  eventType: { type: String, required: true },
  eventTitle: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventNotes: { type: String },
  userId: { type: Schema.Types.ObjectId, required: true },
  profileId: { type: Schema.Types.ObjectId, required: true },
  companyId: { type: Schema.Types.ObjectId, required: true },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('event', eventSchema);