angular.module('chat', []);

angular.module('chat').controller("AppCtrl", function ($scope, $timeout, api, context, socket) {
	$scope.showSignupSpinner = true;
	
	api.getUser().then(function(data){
		if(data.success){
			$scope.showLogin = false;
			context.init(data.user);
			$scope.currentUser = data.user._id;
			getUsers();
		}else {
			$scope.showLogin = true;
		}
	}).catch(function(error){
		$scope.showLogin = false;
	}).finally(function(){
		$scope.showSignupSpinner = false;
	});

	$scope.signup = function(){
		$scope.showSignupSpinner = true;

		api.signup($scope.signup.email, $scope.signup.password, $scope.signup.confirmPassword).then(function(data){
			if(data && data.success){
				$scope.showLogin = false;
				getUsers();
			}
		}).finally(function(){
			$scope.showSignupSpinner = false;
		});
	};

	$scope.signin = function(){
		$scope.showSigninSpinner = true;

		api.signin($scope.signin.email, $scope.signin.password).then(function(data){
			if(data && data.success){
				$scope.showLogin = false;
				context.init(data.user);
				getUsers();
			}
		}).finally(function(){
			$scope.showSigninSpinner = false;
		});
	};

	$scope.logout = function(){
		$scope.showChatSpinner = true;

		api.logout().then(function(data){
			if(data && data.success){
				$scope.showLogin = true;
			}
		}).finally(function(){
			$scope.showChatSpinner = false;
		});		
	};

	$scope.selectUser = function(user){
		$scope.selectedUser = user;
		$scope.showUsers = false;

		if(!$scope.selectedUser.messages){
			$scope.showChatSpinner = true;

			api.getMessages($scope.selectedUser._id).then(function(messages){
				$scope.selectedUser.messages = messages.data;
			}).finally(function(){
				$scope.showChatSpinner = false;
			});
		}
	};

	$scope.sendMessage = function(){
		sendMessage();
	};

	$scope.sendMessageByEnter = function($event){
		if($event && $event.keyCode === 13) {
			sendMessage();
			$event.preventDefault();
		}
	};

	function getUsers(){
		api.getUsers().then(function(data){
			if(data.success){
				$scope.users = data.users.filter(function(user){
					return user._id !== $scope.currentUser;
				});

				if($scope.users.length){
					$scope.selectedUser = $scope.users[0];
					$scope.showChatSpinner = true;

					api.getMessages($scope.selectedUser._id).then(function(messages){
						$scope.selectedUser.messages = messages.data;
					}).finally(function(){
						$scope.showChatSpinner = false;
					});
				}
			}
		});
	};

	function sendMessage(){
		if($scope.newMessage){
			api.sendMessage($scope.newMessage, {
				_id: $scope.selectedUser._id, 
				email: $scope.selectedUser.email}).then(function(data){
					$scope.selectedUser.messages.push(data.message);
				});

			$scope.newMessage = '';
		}
	}

	socket.on('new-message', function (data) {
		if($scope.currentUser === data.message.to._id){
			$scope.users.forEach(function(user){
				if(user._id === data.message.from._id && user.messages){
					user.messages.push(data.message);

					if($scope.selectedUser._id === user._id){
						$timeout(function(){
							$scope.$apply();
						});
					}
				}
			});
		}
	});
});
