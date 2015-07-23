angular.module('chat').factory('socket', function() {
	var socket = io();

	return socket;
});