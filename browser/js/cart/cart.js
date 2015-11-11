app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart',
        templateUrl: 'js/cart/cart.html',
        controller: 'CartCtrl',
        resolve: {
        	cart: function(UsersFactory, AuthService){
                return AuthService.getLoggedInUser()
                .then(function (user) {
                    if (!user) return UsersFactory.getAnonCart();
                    return UsersFactory.getUserCart(user._id);
                });
        	}
        }
    });
});

app.controller('CartCtrl', function ($scope, $state, cart, OrdersFactory, EmailFactory, ProductsFactory) {

    var modifiedItems = [];

    if (cart) $scope.cart = cart;


    $scope.shipped = false;

    $scope.removeItem = function(itemId){
        OrdersFactory.deleteOrderItem($scope.cart._id, itemId);
        $scope.cart.items = $scope.cart.items.filter(function(item){
            return item._id !== itemId;
        })
    }
    $scope.emptyCart = function() {
        OrdersFactory.emptyOrder($scope.cart._id);
        $scope.cart.items = [];
    }

    $scope.saveQuantity = function(item) {
        OrdersFactory.updateOrderItem(cart._id,item._id, {quantity: item.quantity});
        $scope.cartForm[item._id].$setPristine();
        $scope.confirm(item._id);
    }

    $scope.getCartCost = function(){
        if (!$scope.cart) return;
        return OrdersFactory.findOrderCost($scope.cart);
    }

    $scope.checkout = function() {
        var addressString = Object.keys($scope.shipping).reduce(function(prev, key){
            return prev += "\n" + $scope.shipping[key];
        }, "")
        OrdersFactory.updateOrder($scope.cart._id, {status: "Processing", shippingDetails: addressString, orderEmail: $scope.shipping.email})
        .then(function(order) {

            $scope.cart = null;
            $scope.shipped = true;

            EmailFactory.sendEmail({
                to_name: $scope.shipping.email,
                to_email: $scope.shipping.email,
                from_name: 'The StarStore',
                from_email: 'willjacobson1@gmail.com',
                subject: 'Your package is on its way!',
                message_html: 'Your order id is ' + order._id
            });

            return order;
        })
        .then(function (order) {
            var productsToUpdate = [];
            order.items.forEach(function (item){
                productsToUpdate.push(ProductsFactory.updateProduct(item.product._id, {numRemaining: item.product.numRemaining - item.quantity}));
            })
            return Promise.all(productsToUpdate);
        })
    }

    $scope.unconfirm = function (id) {
        if (modifiedItems.indexOf(id) !== -1) return;
        else modifiedItems.push(id);
    }

    $scope.confirm = function (id) {
        var idx = modifiedItems.indexOf(id);
        modifiedItems.splice(idx, 1);
    }

    $scope.formNotConfirmed = function () {
        return !!modifiedItems.length;
    }

    $scope.isEmpty = function () {
        if ($scope.cart) return $scope.cart.items.length === 0;
        else return true;
    }

});
