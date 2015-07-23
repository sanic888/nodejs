var socket = require('socket.io');
var apiService = require('../services/apiService');

module.exports = function(server){
	var io = socket(server);

	apiService.on('new-message', function(data){
		io.emit('new-message', {message: data});
	});
};