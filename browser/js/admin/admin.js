app.config(function ($stateProvider) {
    $stateProvider.state('admin', {
        url: '/admin',
        templateUrl: 'js/admin/admin.html',
        controller: 'AdminCtrl',
        resolve: {
        	users: function (UsersFactory) {
        		return UsersFactory.getUsers();
        	},
        	orders: function (OrdersFactory) {
        		return OrdersFactory.getOrders();
        	},
        	products: function (ProductsFactory) {
        		return ProductsFactory.getProducts();
        	}
        }
    });
});

app.controller('AdminCtrl', function ($scope, $state, users, orders, products, OrdersFactory) {
	$scope.users = users;
	$scope.orders = orders;
	$scope.products = products;

	// change order status
	$scope.changeStatus = function(orderId, orderData) {
		return OrdersFactory.updateOrder(orderId, orderData)
			.then(function () {
				$scope.orders = OrdersFactory.fetchOrderCache();
			});
	};

});