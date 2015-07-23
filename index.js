var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var http = require('http');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongo = require('./server/mongo');
var config = require('./server/config');

var app = express();

require('./server/express')(app, config, function(app){
	require('./server/routes')(app);
});


var server = http.createServer(app);

require('./server/infrastructure/socket.io')(server);

server.listen(config.port);

console.log('Server listening on port ' + config.port);
