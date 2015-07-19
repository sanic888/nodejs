var config = require('../config');
var apiService = require('../services/apiService.js');
var idGenerator = require('../infrastructure/idGenerator');
var crypto = require('crypto');
var api = {};

api.getUser = function(req, res){
	console.log('Hello');

	res.send('hello');
};

api.signup = function(req, res){
	var key = String(Math.round((new Date).valueOf() * Math.random()));
	var hash = crypto.createHash('sha512').update(key + req.body.password).digest('hex');

	apiService.createUser(idGenerator(), req.body.email, hash, key);
};

api.load = function(req, res){
	res.send(config.spaIndexHtmlPath);
};

module.exports = api;

/*module.exports.getRates = function(req, res){
    userService.getRates(req.user.appId, req.body.dateFrom, req.body.dateTo, req.body.searchText, req.body.options || {}).then(function(data){
        res.status(200).send(data);
    }).catch(function(error){
        res.status(400).send(error);
    });
};*/