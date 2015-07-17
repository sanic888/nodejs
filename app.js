angular.module('chat', []);

angular.module('chat').controller("AppCtrl", function ($scope, api) {
	$scope.signup = function(){
		api.signup('t@t.com', 'asdfasdf');
	};
});
