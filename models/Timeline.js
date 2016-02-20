var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timelineSchema = new Schema({
  name: { type: String, unique: true },
  type: String,
  events: [{type: Schema.Types.ObjectId, ref: ['Event']}]
});

timelineSchema.static('findByName', function (name, callback) {
  return this.find({ name: name }, callback);
});


module.exports = mongoose.model('Timeline', timelineSchema);
