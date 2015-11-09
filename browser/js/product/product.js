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

app.controller('ProductCtrl', function ($scope, $state, product, reviews, Session) {
	$scope.product = product;
    $scope.reviews = reviews
    $scope.session = Session

    console.log("Our session is: ", $scope.session)
    $scope.averageRating = function() {
        var total = reviews.reduce(function(current, next) {
                    return current.rating + next.rating
        })
        return total / reviews.length
    }

     $scope.userHasReview = function() {
        console.log("Reviews", $scope.reviews)
        console.log("Session User", $scope.session.user)
        if(!$scope.session.user) return -1;
        return (reviews.filter(function(review) {
            return review.user._id === $scope.session.user._id
        })).length;

     }
    console.log($scope.userHasReview())
});