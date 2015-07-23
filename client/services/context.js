angular.module('chat').factory('context', function() {
    var context = {
        init: function(data){
            this.user = {
                _id: data._id,
                email: data.email
            };
            this.token = data.token;
        },
        user: null,
        token: ''
    };

    return context;
});