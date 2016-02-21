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
 * Get a json of timeline documents.
 */
exports.getRESTTimelines = function(req, res) {
    Timeline
        .findTimelines({})
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
    timeline.type = 'timeline';
    timeline.save(function(err) {
        if (err)
            respondWithError(res, err);
        else
            res.json(timeline);
    });
}

/**
 * GET /rest/baselines
 * Get a json of baseline documents.
 */
exports.getRESTBaselines = function(req, res) {
    Timeline
        .findBaselines({})
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
 * POST /rest/baselines
 * Post a new baseline with name and no events.
 */
exports.postRESTBaselines = function(req, res) {
    var timeline = new Timeline();
    timeline.name = req.body.name;
    timeline.type = 'baseline';
    timeline.save(function(err) {
        if (err)
            respondWithError(res, err);
        else
            res.json(timeline);
    });
}

/**
 * GET /rest/timelines/:name
 * Get a json of a specific timeline document.
 */
exports.getRESTTimeline = function(req, res) {
    Timeline
        .findTimelineByName(req.params.name)
        .populate('events')
        .exec(function(err, timelines) {
            if (err)
                respondWithError(res, err);
            else {
                res.json(timelines[0]);
            }
        });
};

/**
 * GET /rest/baselines/:name
 * Get a json of a specific baseline document.
 */
exports.getRESTBaseline = function(req, res) {
    Timeline
        .findBaselineByName(req.params.name)
        .populate('events')
        .exec(function(err, timelines) {
            if (err)
                respondWithError(res, err);
            else {
                res.json(timelines[0]);
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
          {name: req.params.name, type: 'timeline'}, 
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

/**
 * DELETE /rest/timelines/:name/events/:id
 * Delete an event (by id) of a timeline.
 */
exports.delRESTTimelineEvent = function(req, res) {
    Timeline
        .findOneAndUpdate(
          {name: req.params.name, type: 'timeline'}, 
          {$pull: 
            {events: req.params.id}
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

/**
 * POST /rest/baselines/:name/events
 * Add an event (by id) to a baseline.
 */
exports.postRESTBaselineEvent = function(req, res) {
    Timeline
        .findOneAndUpdate(
          {name: req.params.name, type: 'baseline'}, 
          {$push: 
            {events: req.body.event_id}
          }, 
          {
            safe: true,
            upsert: true
          },
          function(err, timeline) {
            if (err)
                respondWithError(res, err);
            else {
                res.json(timeline);
            }
          }
        );
};

/**
 * DELETE /rest/baselines/:name/events/:id
 * Delete an event (by id) of a timeline.
 */
exports.delRESTBaselineEvent = function(req, res) {
    Timeline
        .findOneAndUpdate(
          {name: req.params.name, type: 'baseline'}, 
          {$pull: 
            {events: req.params.id}
          }, 
          {
            safe: true,
            upsert: true
          },
          function(err, timeline) {
            if (err)
                respondWithError(res, err);
            else {
                res.json(timeline);
            }
          }
        );
};
