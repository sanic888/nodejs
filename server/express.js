var express = require('express');
var passport = require('./infrastructure/passport');
var http = require('http');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongo = require('./mongo');
var config = require('./config');

var expressValidator = require('express-validator');
var compress = require('compression');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var methodOverride = require('method-override');

module.exports = function(app, config, routes) {
  var path = require('path');
  app.set('views', path.join(__dirname, '../client'));
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'ejs');

  // app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(bodyParser.json());
  app.use (function (error, req, res, next){
    //body parser set error status to http status, which need to be returned
    if(error.status){
      var errorResponse = new ErrorResponse();
      errorResponse.addError('', 'invalid JSON');

      res.status(error.status).send(errorResponse);
    } else {
      next();
    }
  });
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(expressValidator());

  app.use(cookieParser());
  app.use(compress());
  if(config.useBuildApp){
    //not best way to serve static content for production
    //TODO: move to nginx, keep this only for dev environment
    app.use(express.static(config.root + '/client/main/dist', {index: false}));
    app.use(express.static(config.root + '/client/landing/dist', {index: false}));
  } else {
    app.use(express.static(path.join(__dirname, '../client')));
  }

  app.use(methodOverride());

  app.use(expressSession({
    secret: config.secrets.session,
    store: new MongoStore({url: config.mongo.session}),
    key: 'sid',
    resave: true,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  routes(app);

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
};
