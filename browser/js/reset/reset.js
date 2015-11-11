app.config(function ($stateProvider) {
	$stateProvider.state('reset', {
		url: '/reset/:uid',
		templateUrl: '/js/reset/reset.html',
		controller: 'ResetCtrl',
		resolve: {
			user: function ($stateParams, UsersFactory) {
				return UsersFactory.getOneUser($stateParams.uid);
			}
		}
	});
});

app.controller('ResetCtrl', function ($scope, user, $rootScope, UsersFactory, AuthService, $state) {
	$scope.user = user;
	$scope.retryError = false;

	$scope.resetLogin = function (details) {
		UsersFactory.resetPassword($scope.user._id, details)
		.then(function (user) {
			$scope.user = user;
            $state.go('home');
		})
		.then(null, function (err) {
			$scope.retryError = true;
		})
	};

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
		if ($scope.user && $scope.user.resetRequired) {
			event.preventDefault();
		}
	});
});