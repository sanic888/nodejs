angular.module('chat', []);

angular.module('chat').controller("AppCtrl", function ($scope, api) {
	api.getUser().then(function(user){
		if(user.success){
			$scope.showLogin = false;
			getUsers();
		}else {
			$scope.showLogin = true;
		}
	}).catch(function(error){
		$scope.showLogin = false;
	}).finally(function(){

	});

	$scope.signup = function(){
		api.signup($scope.signup.email, $scope.signup.password, $scope.signup.confirmPassword).then(function(data){
			if(data && data.success){
				$scope.showLogin = false;
				getUsers();
			}
		});;
	};

	$scope.signin = function(){
		api.signin($scope.signin.email, $scope.signin.password).then(function(data){
			if(data && data.success){
				$scope.showLogin = false;
				getUsers();
			}
		});
	};

	$scope.logout = function(){
		api.logout().then(function(data){
			if(data && data.success){
				$scope.showLogin = true;
			}
		});		
	};

	$scope.selectUser = function(user){
		$scope.selectedUser = user;
		$scope.showUsers = false;
	}

	function getUsers(){
		api.getUsers().then(function(data){
			if(data.success){
				$scope.users = data.users;

				if($scope.users.length){
					$scope.selectedUser = $scope.users[0];
				}
			}
		});
	}
});
