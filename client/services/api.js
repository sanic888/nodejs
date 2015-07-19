angular.module('chat').factory('api', function(httpModel) {
    var api = {
        signup: function (email, password, confirmPassword) {
          return httpModel.post('/signup', {email: email, password: password, confirmPassword: confirmPassword});
        },
        getUser: function () {
          return httpModel.get('/get-user');
        }
    };

	return api;
});
