var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongo = require('../mongo');
var crypto = require('crypto');

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

passport.use(new localStrategy({
		usernameField: 'email',
        passwordField: 'password'
    },
	function(username, password, done){
	    mongo.Users.findOne({email: username}, {}, function(err, result){
	    	if(!result){
	    		return done({message: 'There is no such user.'}, false);
	    	}

			var hash = crypto.createHash('sha512').update(result.key + password).digest('hex');

			if (result.hash === hash){
				var user = {
					id: result._id,
					username: username
				};

				return done(null, user);
			}else {
				return done({message: 'Invalid password'}, false);
			}
	    });
}));

module.exports = passport;