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

app.controller('AdminCtrl', function ($scope, $state, users, orders, products, OrdersFactory, UsersFactory, ProductsFactory) {
	$scope.users = users;
	$scope.orders = orders;
	$scope.products = products;
    $scope._status = '';

	// change order status
	$scope.changeOrderStatus = function(orderId, orderData) {
		return OrdersFactory.updateOrder(orderId, orderData)
			.then(function () {
				$scope.orders = OrdersFactory.fetchOrderCache();
			});
	};

    $scope.deleteUser = function(id) {
        UsersFactory.deleteUser(id)
        .then(function() {
            $scope.users = UsersFactory.fetchUsersCache();
        });
    };

    $scope.changeAdminStatus = function(user) {
        var newStatus = !user.isAdmin;
        UsersFactory.updateUser(user._id, {isAdmin: newStatus})
        .then(function(updatedUser) {
            $scope.users = UsersFactory.fetchUsersCache();
        });
    };

    $scope.changeProductDetails = function (id, details) {
        console.log($scope.edit);
        console.log(details);
        ProductsFactory.updateProduct(id, details)
        .then(function () {
            $scope.products = ProductsFactory.fetchProductsCache();
        });
    };

});