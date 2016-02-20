var _ = require('lodash');
var Event = require('../models/Event');

function respondWithError(res, err){
  if (process.env.NODE_ENV != "production") 
    res.status(500).json({ error: err });
  else
    res.status(500).json({ error: 'Errors happen' });
}

/**
 * GET /rest/events
 * Get a json of service documents.
 */
exports.getRESTEvents = function(req, res) {
	Event.find({}, function(err, events){
	  if (err)
	    respondWithError(res, err);
	  else
	    res.json(events);
	});
};

/**
 * POST /rest/events
 * Post a new event with caption, description, startdate, optional enddate, 
 * 	optional array of src in format {srcType, srcURL}.
 */
exports.postRESTEvents = function(req, res) {
  var eventEntity = new Event();
  eventEntity.caption = req.body.caption;
  eventEntity.description = req.body.description; 
  eventEntity.startDate = req.body.startDate;
  eventEntity.endDate = req.body.endDate; 
  if (req.body.src)
  {
  	eventEntity.srcType = req.body.src.srcType;
  	eventEntity.srcURL = req.body.src.srcURL;
  }
  eventEntity.save(function(err) {
      if (err)
        respondWithError(res, err);
      else
        res.json({ message: 'Event created!' });
  });
}