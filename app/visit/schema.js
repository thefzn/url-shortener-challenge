const mongo = require('../../server/mongodb');
const mongoose = require('mongoose');

module.exports = mongo.model('Visit', new mongoose.Schema({
  hash: String,
  date: {
    type: Date,
    default: Date.now
  },
  os: String,
  platform: String,
  browser: String,
  country: String,
  state: String,
}));
