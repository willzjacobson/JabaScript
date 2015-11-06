app.config(function ($stateProvider) {
    $stateProvider.state('product', {
        url: '/product/:pid',
        templateUrl: 'js/product/product.html',
        controller: 'ProductCtrl',
        resolve: {
        	product: function ($stateParams, ProductsFactory) {
        		return ProductsFactory.getOneProduct($stateParams.pid)
        	},
        	reviews: function ($stateParams, ProductsFactory) {
        		return ProductsFactory.getReviews($stateParams.pid)
        	}
        }
    });
});

app.controller('ProductCtrl', function ($scope, $state, product, reviews) {
	$scope.product = product;
    $scope.reviews = reviews

    $scope.averageRating = function() {
        var total = reviews.reduce(function(current, next) {
                    return current.rating + next.rating
        })
        return total / reviews.length
    }
});