var config = require('../config');
var apiService = require('../services/apiService.js');
var idGenerator = require('../infrastructure/idGenerator');
var crypto = require('crypto');
var passport = require('../infrastructure/passport');
var ErrorResponse = require('../infrastructure/errorResponse');
var jwt = require('jsonwebtoken');
var api = {};

api.getUser = function(req, res){
	if (req.isAuthenticated()){
        apiService.getUser(req.user._id).then(function(user){
            res.send({
                success: true,
                user: {
                    token: jwt.sign({ _id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 }),
                    _id: user._id,
                    email: user.email
                }
            });
        });
    }else {
        res.send({success: false});
    }
};

api.getUsers = function(req, res){
    apiService.getUsers().then(function(users){
        res.send({success: true, users: users});
    })
};

api.signup = function(req, res){
	var key = String(Math.round((new Date).valueOf() * Math.random()));
	var hash = crypto.createHash('sha512').update(key + req.body.password).digest('hex');

	apiService.createUser(idGenerator(), req.body.email, hash, key).then(function(data){
        res.send({success: true});
    });
};

api.load = function(req, res){
	res.send(config.spaIndexHtmlPath);
};

api.signin = function(req, res){
	function errorHandler(error) {
        var errorResponse = new ErrorResponse()
        errorResponse.addError('password', error);
        return res.status(400).send(errorResponse);
    }

    passport.authenticate('local',  function(err, user) {
        if (err) { 
            return errorHandler(err); 
        }

        if (!user) { 
            errorHandler("There's no such user or the email or password are typed incorrectly. Please check them.");
        }

        req.logIn(user, function(err) {
            if (err) { 
                return errorHandler(err); 
            }

            return res.send({
                success: true, 
                user: {
                    token: jwt.sign({ _id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 }),
                    _id: user._id,
                    email: user.email
                }
            });
        });

    })(req, res, errorHandler);
};

api.logout = function(req, res){
    req.logout();
    res.status(200).send({success: true});
};

api.sendMessage = function(req, res){
    apiService.addMessage(idGenerator(), {
        _id: req.user._id, 
        email: req.user.email}, 
        req.body.to, 
        req.body.message).then(function(message){
            console.log(message);
            res.status(200).send({success: true, message: message});
        });
};

api.getMessages = function(req, res){
    apiService.getMessages(req.user._id, req.params.id).then(function(data){
        res.status(200).send({success: true, data: data});
    });
};

module.exports = api;
