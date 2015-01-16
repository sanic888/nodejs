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
	var config = {
		server	: 'localhost',
		user 	: 'sa',
		password: '11',
		database: 'databasenm'
	};

	var connection = new mssql.Connection(config, function(err) {
	    var request = connection.request();
	    var query = _format("SELECT * FROM users WHERE id = ?", [id]);

	    request.query(query, function(err, results, fields){
			var user = {
				id: id,
				username: results[0].username,
				password: results[0].password
			};

			done(err, user);
	    });
	});
});

passport.use(new localStrategy(function(username, password, done){
	var config = {
		server	: 'localhost',
		user 	: 'sa',
		password: '11',
		database: 'databasenm',
		options: {
	        encrypt: true // Use this if you're on Windows Azure
	    }
	};

	var connection = new mssql.Connection(config, function(err) {
	    var request = connection.request(); // or: var request = connection.request();
	    var query = _format("SELECT * FROM users WHERE username = '?'", [username]);
	    request.query(query, function(err, results){
				if(err){
					return done(err);
				}else if (results.length === 0){
					return done(null, false, {message: 'Unknown user ' + username});
				}else {
					if (results[0].password === password){
						var user = {id: results[0].id,
									username: username,
									password: password};
						return done(null, user);
					}else {
						return done(null, false, {message: 'Invalid password'});
					}
				}
		});
	});


	// client.connect();

	// client.query(
	// 	'SELECT top 1 userid, password, salt FROM user WHERE username = ?',
	// 	[username],
	// 	function(err, result, fields){
	// 		if(err){
	// 			return done(err);
	// 		}else if (result.length === 0){
	// 			return done(null, false, {message: 'Unknown user ' + username});
	// 		}else {
	// 			var newhash = crypto.createHash('sha512')
	// 							.update(result[0].salt + password)
	// 							.digest('hex');

	// 			if (result[0].password === newhash){
	// 				var user = {id: result[0].userid,
	// 							username: username,
	// 							password: newhash};
	// 				return done(null, user);
	// 			}else {
	// 				return done(null, false, {message: 'Invalid password'});
	// 			}
	// 		}

	// 		client.end();
	// 	}
	// );
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
