app.config(function ($stateProvider) {
    $stateProvider.state('profile', {
        url: '/profile/:uid',
        templateUrl: 'js/profile/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
        	user: function ($stateParams, UsersFactory) {
        		return UsersFactory.getOneUser($stateParams.uid);
        	},
        	reviews: function ($stateParams, UsersFactory) {
        		return UsersFactory.getUserReviews($stateParams.uid);
        	},
        	orders: function ($stateParams, UsersFactory) {
        		return UsersFactory.getUserOrders($stateParams.uid);
        	}
        }
    });
});

app.controller('ProfileCtrl', function ($scope, $state, user, reviews, orders, OrdersFactory) {
	$scope.user = user;
	$scope.reviews = reviews;
	$scope.orders = orders;

    $scope.getTotalOrderCost = function(order){
        return OrdersFactory.findOrderCost(order);
    }

});

app.config(function ($stateProvider) {
    $stateProvider.state('profile.history', {
        url: '/history',
        templateUrl: 'js/profile/profile.history.html'
    });
});

app.config(function ($stateProvider) {
    $stateProvider.state('profile.edit', {
        url: '/edit',
        templateUrl: 'js/profile/profile.edit.html'
    });
});