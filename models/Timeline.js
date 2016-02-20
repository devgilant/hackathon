var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timelineSchema = new Schema({
  name: { type: String, unique: true },
  type: String,
  events: [{type: Schema.Types.ObjectId, ref: ['Event']}]
});

module.exports = mongoose.model('Timeline', timelineSchema);
