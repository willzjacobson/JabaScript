app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart/:uid',
        templateUrl: 'js/cart/cart.html',
        controller: 'CartCtrl',
        resolve: {
        	cart: function($stateParams,UsersFactory){
        		return UsersFactory.getUserCart($stateParams.uid);
        	}
        }
    });
});

app.controller('CartCtrl', function ($scope, $state, cart, OrdersFactory) {
    $scope.cart = cart;
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




});