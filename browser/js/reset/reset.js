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

app.controller('ResetCtrl', function ($scope, user, $rootScope) {
	$scope.user = user;

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
		if (user && user.resetRequired) {
			event.preventDefault();
		}
	});
});