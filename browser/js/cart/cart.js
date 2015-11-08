app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'js/cart/cart.html',
        controller: 'CartCtrl',
        resolve: {
        	cart: function(UsersFactory, AuthService){
                return AuthService.getLoggedInUser()
                .then(function (user) {
                    if (!user) return null;
                    return UsersFactory.getUserCart(user._id);
                });
        	}
        }
    });
});

app.controller('CartCtrl', function ($scope, $state, cart, OrdersFactory) {
    if (cart) $scope.cart = cart;
    $scope.shipped = false;

    $scope.removeItem = function(itemId){
        OrdersFactory.deleteOrderItem($scope.cart._id, itemId);
        $scope.cart.items = $scope.cart.items.filter(function(item){
            return item._id !== itemId;
        })
        // $scope.$digest();
    }
    $scope.emptyCart = function() {
        OrdersFactory.emptyOrder($scope.cart._id);
        $scope.cart.items = [];
    }

    $scope.saveQuantity = function(item) {
        OrdersFactory.updateOrderItem(cart._id,item._id, {quantity: item.quantity});
        $scope.cartForm[item._id].$setPristine();
    }

    $scope.getCartCost = function(){
        if (!$scope.cart) return;
        return OrdersFactory.findOrderCost($scope.cart);
    }

    $scope.checkout = function() {
        
        var addressString = Object.keys($scope.shipping).reduce(function(prev, key){
            return prev += "\n" + $scope.shipping[key];
        }, "")
        OrdersFactory.updateOrder($scope.cart._id, {status: "Processing", shippingDetails: addressString})
        .then(function(success){
            $scope.cart = null;
            $scope.shipped = true;
            console.log("We succesfully checked out");
        })
        .then(null, function(err){
            console.log("Erred");
        })
    }




});