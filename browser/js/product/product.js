app.config(function ($stateProvider) {
    $stateProvider.state('product', {
        url: '/product/:pid',
        templateUrl: 'js/product/product.html',
        controller: 'ProductCtrl',
        resolve: {
        	product: function ($stateParams, ProductsFactory) {
        		return ProductsFactory.getOneProduct($stateParams.pid)
        	}
        	// reviews: function ($stateParams, ReviewsFactory) {
        	// 	return 
        	// }
        }
    });
});

app.controller('ProductCtrl', function ($scope, $state, product) {
	$scope.product = product;
});