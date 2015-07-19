angular.module('chat', []);

angular.module('chat').controller("AppCtrl", function ($scope, api) {
	api.getUser().then(function(user){

	}).catch(function(error){

	}).finally(function(){

	});

	$scope.signup = function(){
		api.signup($scope.email, $scope.password, $scope.confirmPassword);
	};
});
