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

app.controller('ResetCtrl', function ($scope, user) {
	$scope.user = user;
});