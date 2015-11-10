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
    })
    .state('admin.users', {
        url: '/users',
        templateUrl: 'js/admin/admin.users.html'
    })
    .state('admin.products', {
        url: '/products',
        templateUrl: 'js/admin/admin.products.html'
    })
    .state('admin.orders', {
        url: '/orders',
        templateUrl: 'js/admin/admin.orders.html'
    });

});

app.controller('AdminCtrl', function ($scope, $state, users, orders, products, OrdersFactory, UsersFactory, ProductsFactory, EmailFactory) {
	$scope.users = users;
	$scope.orders = orders;
	$scope.products = products;
    $scope._status = '';
    $scope.showInput = false;
    $scope.toggle = function () {
        $scope.showInput = !$scope.showInput;
    }

    $scope.getTotalOrderCost = function(order){
        return OrdersFactory.findOrderCost(order);
    }

	// change order status
	$scope.changeOrderStatus = function(orderId, orderData) {
		return OrdersFactory.updateOrder(orderId, orderData)
			.then(function (order) {
                EmailFactory.sendEmail({
                    to_name: order.orderEmail,
                    to_email: order.orderEmail,
                    from_name: 'The StarStore',
                    from_email: 'willjacobson1@gmail.com',
                    subject: 'Order status change!',
                    message_html: 'Your order id ' + order._id + ' now has a status of ' + order.status
                })
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
        ProductsFactory.updateProduct(id, details)
        .then(function () {
            $scope.products = ProductsFactory.fetchProductsCache();
        });
    };

    $scope.createProduct = function(productData) {
        ProductsFactory.createProduct(productData)
        .then(function(newProduct) {
            $scope.showInput = false;
            $scope.products = ProductsFactory.fetchProductsCache();
        });

    };

    $scope.deleteImage = function (productId, idx) {
        ProductsFactory.deleteProductImage(productId, idx)
        .then(function(updateProduct) {
            $scope.products = ProductsFactory.fetchProductsCache();
        });
    };

    $scope.triggerReset = function (user) {
        UsersFactory.triggerReset(user)
        .then(function (user) {
            console.log(user);
            $scope.users = UsersFactory.fetchUsersCache();
        })
    }

});


/*EmailFactory.sendEmail({
                to_name: $scope.shipping.email,
                to_email: $scope.shipping.email,
                from_name: 'The StarStore',
                from_email: 'willjacobson1@gmail.com',
                subject: 'Your package is on its way!',
                message_html: 'Your order id is ' + order._id
            })*/





