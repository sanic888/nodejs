var express = require('express');
var compose = require('composable-middleware');
var expressJwt = require('express-jwt');
var config = require('../config');
var validateJwt = expressJwt({ secret: config.secrets.session });
var controller = require('./index');
var apiService = require('../services/apiService.js');
var router = express.Router();

function ensureAuthenticated(req, res, next){
/*	if (req.isAuthenticated()){
		return next();
	}*/

	return compose().use(function(req, res, next) {
		// allow access_token to be passed through query parameter as well
		if(req.query && req.query.hasOwnProperty('access_token')) {
			req.headers.authorization = 'Bearer ' + req.query.access_token;
		}

		validateJwt(req, res, next);
	}).use(function(req, res, next) {
		apiService.getUser(req.user._id).then(function(user){
			if (!user) {
				return res.send(401);
			}

			req.user = user;
			next();
		}).fail(function(err){
			next(err);
		}).done();
	});
};

router.get('/get-user', controller.getUser);
router.post('/signup', controller.signup);
router.post('/signin', controller.signin);
router.post('/logout', ensureAuthenticated(), controller.logout);
router.get('/get-users', ensureAuthenticated(), controller.getUsers);
router.get('/get-messages/:id', ensureAuthenticated(), controller.getMessages)
router.post('/send-message', ensureAuthenticated(), controller.sendMessage);
router.get('/', controller.load);

module.exports = router;