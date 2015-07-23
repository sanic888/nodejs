angular.module('chat').factory('api', function(httpModel) {
    var api = {
        signup: function (email, password, confirmPassword) {
        	return httpModel.post('/signup', {email: email, password: password, confirmPassword: confirmPassword});
        },
        getUser: function () {
        	return httpModel.get('/get-user');
        },
        signin : function(email, password){
        	return httpModel.post('/signin', {email: email, password: password});
        },
        logout : function(){
            return httpModel.post('/logout');
        },
        getUsers: function () {
            return httpModel.get('/get-users');
        },
        sendMessage: function(message, to) {
            return httpModel.post('/send-message', {message: message, to: to});
        },
        getMessages: function(id){
            return httpModel.get('/get-messages/' + id);
        }
    };

	return api;
});
