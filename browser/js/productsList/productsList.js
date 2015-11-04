app.config(function ($stateProvider) {
    $stateProvider.state('productsList', {
        url: '/productslist',
        templateUrl: 'js/productsList/productsList.html',
        controller: 'ProductsListCtrl',
        resolve: {
        	products: function (ProductsFactory) {
        		return ProductsFactory.getProducts();
        	}
        }
    });
});

app.controller('ProductsListCtrl', function ($scope, $state) {
	$scope.products = products;
});