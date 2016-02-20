var _ = require('lodash');
var Timeline = require('../models/Timeline');

function respondWithError(res, err) {
    if (process.env.NODE_ENV != "production")
        res.status(500).json({
            error: err
        });
    else
        res.status(500).json({
            error: 'Errors happen'
        });
}

/**
 * GET /rest/timelines
 * Get a json of service documents.
 */
exports.getRESTTimelines = function(req, res) {
    Timeline
        .find({})
        .populate('events')
        .exec(function(err, timelines) {
            if (err)
                respondWithError(res, err);
            else {
                res.json(timelines);
            }
        });
};

/**
 * POST /rest/timelines
 * Post a new timeline with name, type and no events.
 */
exports.postRESTTimelines = function(req, res) {
    var timeline = new Timeline();
    timeline.name = req.body.name;
    timeline.type = req.body.type;
    timeline.save(function(err) {
        if (err)
            respondWithError(res, err);
        else
            res.json({
                message: 'Timeline created!'
            });
    });
}

/**
 * GET /rest/timelines/:name
 * Get a json of a specific timeline document.
 */
exports.getRESTTimeline = function(req, res) {
    Timeline
        .findByName(req.params.name)
        .populate('events')
        .exec(function(err, timelines) {
            if (err)
                respondWithError(res, err);
            else {
                res.json(timelines);
            }
        });
};

/**
 * POST /rest/timelines/:name/events
 * Add an event (by id) to a timeline.
 */
exports.postRESTTimelineEvent = function(req, res) {
    Timeline
        .findOneAndUpdate(
          {name: req.params.name}, 
          {$push: 
            {events: req.body.event_id}
          }, 
          {
            safe: true,
            upsert: true
          },
          function(err, timelines) {
            if (err)
                respondWithError(res, err);
            else {
                res.json(timelines);
            }
          }
        );
};
