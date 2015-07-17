angular.module('chat').factory('api', function(httpModel) {
    var api = {
        signup: function (email, password) {
          return httpModel.post('/signup', {email: email, password: password});
        }
    };

	return api;
});
