var express = require('express');
var controller = require('./index');
var router = express.Router();
//var auth = require('./../auth/auth.service');

function ensureAuthenticated(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}

	res.send({success: false});
};

router.get('/get-user', controller.getUser);
router.post('/signup', controller.signup);
router.post('/signin', controller.signin);
router.get('/logout', ensureAuthenticated, controller.logout);
router.get('/get-users', ensureAuthenticated, controller.getUsers);
router.post('/send-message', ensureAuthenticated, controller.sendMessage);
router.get('/', controller.load);

module.exports = router;