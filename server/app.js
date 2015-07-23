var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongo = require('./mongo');
var config = require('./config');

var app = express();

require('./express')(app, config, function(app){
	require('./routes')(app);
});


var server = http.createServer(app);

require('./infrastructure/socket.io')(server);

server.listen(config.port);

console.log('Server listening on port ' + config.port);
