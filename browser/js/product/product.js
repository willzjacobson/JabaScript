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

app.controller('ProductCtrl', function ($scope, $state, product, reviews, Session, ReviewsFactory) {
	$scope.product = product;
    $scope.reviews = reviews
    $scope.session = Session
    $scope.reviewTime = false;
    $scope.shouldShowContentError = function() {
        return $scope.newReview.title.$dirty && $scope.newReview.rating.$dirty && $scope.newReview.content.$invalid;
    }

    $scope.buttonText = function() {
        if ($scope.reviewTime) return "Cancel"
        else return "Write Review"
    }

    $scope.createReview = function() {
        $scope.newReviewModel.product = $scope.product._id;
        $scope.newReviewModel.user = $scope.session.user._id;
        console.log('lalala', $scope.newReviewModel)
        ReviewsFactory.createReview($scope.newReviewModel)
        .then(function(newReview) {
            $scope.reviewTime = false;
            $scope.reviews = ReviewsFactory.fetchReviewsCache();
        })
    }
    $scope.hasReviews = function() {
        return $scope.reviews.length > 0;
    }

    $scope.showReviewForm = function() {
        $scope.reviewTime = !$scope.reviewTime
    }

    $scope.averageRating = function() {
        if(reviews.length === 1) return reviews[0].rating
        var total = reviews.reduce(function(current, next) {
                    return current.rating + next.rating
        })
        return total / reviews.length
    }

    $scope.userHasReview = function() {
        if(!$scope.session.user) return -1;
        return (reviews.filter(function(review) {
            return review.user._id === $scope.session.user._id
        })).length;

    }
});