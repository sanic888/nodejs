var mongo = require('./../mongo');
var BaseDataService = require('./../infrastructure/baseDataService');
var serviceUsers = new BaseDataService(mongo.Users);
var serviceMessages = new BaseDataService(mongo.Messages);
var _ = require('lodash');
var em = require('events').EventEmitter;

var apiService = {};

apiService.createUser = function(id, email, hash, key){
	return serviceUsers.save({
        _id: id,
        email: email,
        hash: hash,
        key: key
    });
};

apiService.getUsers = function(){
	return serviceUsers.find({}, {_id: 1, email: 1});
};

apiService.getUser = function(id){
	return serviceUsers.findOne({_id: id}, {_id: 1, email: 1});
};

apiService.addMessage = function(id, from, to, message){
	var date = new Date(),
		message = {
			_id: id, 
			from: from, 
			to: to, 
			message: message, 
			createdOn: date
		};

	return serviceMessages.save(message).then(function(message){
		apiService.emit('new-message', message);
		return message;
	});
};

apiService.getMessages = function(user1, user2){
	return serviceMessages.find({$or: [{'from._id': user1, 'to._id': user2}, {'from._id': user2, 'to._id': user1}]}, {sort: {createdOn: 1}});
};

_.extend(apiService, em.prototype);

module.exports = apiService;