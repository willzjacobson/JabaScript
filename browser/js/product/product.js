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

app.controller('ProductCtrl', function ($scope, $state, product, reviews, UsersFactory, AuthService, OrdersFactory) {
	$scope.product = product;
    $scope.reviews = reviews

    function hasProductInCart(cart, pid) {
        return cart.items.some(function (item) {
            return item.product._id === pid;
        });
    }

    $scope.addToCart = function () {
        var theUser;

        AuthService.getLoggedInUser()
        .then(function (user) {
            theUser = user;
            if (!user) {
                // make fake cart for user with cart.anon = true;
            } else {
                return UsersFactory.getUserCart(user._id);
            }
        })   
        .then(function (cart){
            if (!cart) return OrdersFactory.createOrder({user: theUser._id})
            return cart;
        })     
        .then(function (cart) {
            if( cart.anon){ 
                // anon
            } 
            else {
                if (hasProductInCart(cart, product._id)) return {};
                else return OrdersFactory.createOrderItem(cart._id, {
                    product: product._id,
                    priceWhenOrdered: $scope.product.price,
                    quantity: 1
                })
            }
        })
        .then(function (item) {
            console.log('Added ', item, ' successfully');
            $state.go('cart');
        })
        .catch(function (err) {
            console.log('An error occurred')
        });
    }

    $scope.averageRating = function() {
        var total = reviews.reduce(function(current, next) {
            return current + next.rating
        }, 0);
        return total / reviews.length
    }
});