/**
 * Module dependencies.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var dotenv = require('dotenv');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');
var _ = require('lodash');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var eventController = require('./controllers/event');
var timelineController = require('./controllers/timeline');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  sourceMap: true,
  outputStyle: 'expanded'
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
//app.use(passport.initialize());
//app.use(passport.session());/
app.use(flash());
app.use(lusca({
  csrf: false,
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


/**
 * Primary app routes.
 */
app.get('/', homeController.index);
//app.get('/login', userController.getLogin);
//app.post('/login', userController.postLogin);

/**
 * REST routes.
 */
app.get('/rest/events', eventController.getRESTEvents);
app.post('/rest/events', eventController.postRESTEvents);
app.get('/rest/timelines', timelineController.getRESTTimelines);
app.post('/rest/timelines', timelineController.postRESTTimelines);
app.get('/rest/timelines/:name', timelineController.getRESTTimeline);
app.post('/rest/timelines/:name/events', timelineController.postRESTTimelineEvent);
app.delete('/rest/timelines/:name/events/:id', timelineController.delRESTTimelineEvent);
app.get('/rest/baselines', timelineController.getRESTBaselines);
app.post('/rest/baselines', timelineController.postRESTBaselines);
app.get('/rest/baselines/:name', timelineController.getRESTBaseline);
app.post('/rest/baselines/:name/events', timelineController.postRESTBaselineEvent);
app.delete('/rest/baselines/:name/events/:id', timelineController.delRESTBaselineEvent);


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
