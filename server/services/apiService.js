var mongo = require('./../mongo');
var BaseDataService = require('./../infrastructure/baseDataService');
var service = new BaseDataService(mongo.Users);

var apiService = {};

apiService.createUser = function(id, email, hash, key){
	return service.save({
        _id: id,
        email: email,
        hash: hash,
        key: key
    });
}

module.exports = apiService;