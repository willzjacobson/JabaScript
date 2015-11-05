app.config(function ($stateProvider) {
    $stateProvider.state('cart', {
        url: '/cart/:uid',
        templateUrl: 'js/cart/cart.html',
        controller: 'CartCtrl',
        resolve: {
        	curOrder: function($stateParams,UsersFactory){
        		return {};
        	}
        }
    });
});

app.controller('CartCtrl', function ($scope, $state) {

});