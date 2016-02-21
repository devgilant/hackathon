var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var srcTypes = 'audio image video'.split(' ');

var eventSchema = new Schema({
  caption: String,
  description: String,
  startDate: Date,
  endDate: Date,
  srcType: {type: String, enum: srcTypes},
  srcURL: String
});

module.exports = mongoose.model('Event', eventSchema);
