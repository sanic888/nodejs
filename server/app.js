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


/*function ensureAuthenticated(req, res, next){
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
    mongo.Users.findOne({_id: id}, {}, function(err, result){
    	var user = {
			id: id,
			username: result.username,
			password: result.password
		};

		done(err, user);
    });
});

passport.use(new localStrategy(function(username, password, done){
    mongo.Users.findOne({username: username}, {}, function(err, result){
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

var path = require('path');
app.set('views', path.join(__dirname, '../client'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use(cookieParser('keyboard cat'));
app.use(expressSession());

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(express.static(path.join(__dirname, '../client')));

app.get('/', ensureAuthenticated, function(req, res){
	res.send(config.spaIndexHtmlPath);
	// res.end('page: index, user authenticate ' + req.user);
});

app.get('/admin', ensureAuthenticated, function(req, res){
	res.render('admin', {title: 'authenticate', user: req.user});
	// res.end('page: admin, user authenticate ' + req.user);
});

app.get('/login', function(req, res){
	console.log('eeeeeeeee11111111');

	var username = req.user ? req.user.username : '';
	res.send(config.spaIndexHtmlPath);
	// res.end('page: login, user authenticate ' + username + ', message: ' + req.flash('error'));
});

app.post('/login', 
	passport.authenticate('local', {failureRedirect: '/login',
									failureFlash: true}),
	function(req, res){
		res.redirect('/admin');
	}
);

app.post('/signup', function(req, res){
	console.dir(req.body);
});*/



http.createServer(app).listen(config.port);

console.log('Server listening on port ' + config.port);
