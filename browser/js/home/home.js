app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl',
        resolve: {
        	products: function (ProductsFactory) {
        		return ProductsFactory.getProducts()
                .then(function (products) {
                    return products.filter(function (product) {
                        return product.numRemaining > 0;
                    })
                })
        	},
            categories: function (products) {
                var uniqueCategories = new Set();
                products.forEach(function(product){
                    product.category.forEach(function(categoryItem){
                        uniqueCategories.add(categoryItem);
                    })
                })

                var ourSet = Array.from(uniqueCategories);
                return ourSet;
            }
        }
    });
});

app.controller('HomeCtrl', function ($scope, $state, products, categories) {
	$scope.products = products;
    $scope.categories = categories;
});