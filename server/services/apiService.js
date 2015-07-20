var mongo = require('./../mongo');
var BaseDataService = require('./../infrastructure/baseDataService');
var serviceUsers = new BaseDataService(mongo.Users);
var serviceMessages = new BaseDataService(mongo.Messages);

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

apiService.addMessage = function(id, from, to, message){
	return serviceMessages.save({_id: id, from: from, to: to, message: message});
};

module.exports = apiService;