var express = require('express');
var controller = require('./index');
var router = express.Router();
//var auth = require('./../auth/auth.service');

router.get('/get-user', controller.getUser);
router.post('/signup', controller.signup);
router.get('/', controller.load);
//router.get('/current', auth.isAuthenticated(),  controller.getUser);

module.exports = router;