var express = require('express');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var http = require('http');
var mssql = require('mssql');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var mongo = require('mongoskin');
var db = {};

db.stage = mongo.db("mongodb://localhost:27017/dev-messenger", {native_parser: true});

db.stage.on('error', function (err) {
    console.log('connection Error: ' + err);
});

db.stage.on('connected', function () {
    console.log('connected');
});

db.stage.on('reconnected', function () {
    console.log('reconnected');
});

db.stage.on('disconnected', function () {
    console.log('disconnected');
});

var collections = {
    Users: db.stage.collection('users'),
    Messages: db.stage.collection('messages')
};

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
};

function _format(query, params){
	return query.replace(/\?/g, function(a1, a2, a3, a4, a5, a6){
		return params.shift();
	});
}

passport.serializeUser(function(user, done){
	done(null, user.id);
});

passport.deserializeUser(function(id, done){
    collections.Users.findOne({_id: id}, {}, function(err, result){
    	var user = {
			id: id,
			username: result.username,
			password: result.password
		};

		done(err, user);
    });
});

passport.use(new localStrategy(function(username, password, done){
    collections.Users.findOne({username: username}, {}, function(err, result){
    	if(!result){
    		return done(null, false, {message: 'There is no such user.'});
    	}

		if (result.password === password){
			var user = {
				id: result._id,
				username: username,
				password: password
			};

			return done(null, user);
		}else {
			return done(null, false, {message: 'Invalid password'});
		}
    });
}));

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(cookieParser('keyboard cat'));
app.use(expressSession());

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(express.static(__dirname + '/public'));

app.get('/', ensureAuthenticated, function(req, res){
	var s1 = module;
	var s2 = exports;
	
	res.render('index', {title: 'authenticate', user: req.user});
	// res.end('page: index, user authenticate ' + req.user);
});

app.get('/admin', ensureAuthenticated, function(req, res){
	res.render('admin', {title: 'authenticate', user: req.user});
	// res.end('page: admin, user authenticate ' + req.user);
});

app.get('/login', function(req, res){
	var username = req.user ? req.user.username : '';
	res.render('login', {title: 'authenticate', username: username, message: req.flash('error')});
	// res.end('page: login, user authenticate ' + username + ', message: ' + req.flash('error'));
});

app.post('/login', 
	passport.authenticate('local', {failureRedirect: '/login',
									failureFlash: true}),
	function(req, res){
		res.redirect('/admin');
	}
);

http.createServer(app).listen(3000);

console.log('Server listening on port 3000');
