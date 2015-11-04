app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        resolve: {
        	products: function (ProductsFactory) {
        		return ProductsFactory.getProducts();
        	}
        }
    });
});

app.controller('HomeCtrl', function ($scope, $state, products) {
	$scope.products = products;
});