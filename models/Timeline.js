var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var timelineTypes = 'timeline baseline'.split(' ');

var timelineSchema = new Schema({
    name: { type: String, unique: true },
    type: { type: String, enum: timelineTypes },
    events: [{ type: Schema.Types.ObjectId, ref: ['Event'] }]
});

timelineSchema.static('findTimelines', function(criteria, callback) {
    criteria.type = 'timeline';
    return this.find(criteria, callback);
});

timelineSchema.static('findBaselines', function(criteria, callback) {
    criteria.type = 'baseline';
    return this.find(criteria, callback);
});

timelineSchema.static('findTimelineByName', function(name, callback) {
    return this.findTimelines({ name: name}, callback);
});

timelineSchema.static('findBaselineByName', function(name, callback) {
    return this.findBaselines({ name: name}, callback);
});

module.exports = mongoose.model('Timeline', timelineSchema);
