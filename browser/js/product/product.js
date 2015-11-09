app.config(function ($stateProvider) {
    $stateProvider.state('product', {
        url: '/product/:pid',
        templateUrl: 'js/product/product.html',
        controller: 'ProductCtrl',
        resolve: {
        	product: function ($stateParams, ProductsFactory) {
        		return ProductsFactory.getOneProduct($stateParams.pid)
        	},
        	reviews: function ($stateParams, ReviewsFactory) {
        		return ReviewsFactory.getReviewsForProduct($stateParams.pid)
        	}
        }
    });
});

app.controller('ProductCtrl', function ($scope, $state, product, reviews, Session, ReviewsFactory) {

	$scope.product = product;
    $scope.reviews = reviews
    $scope.session = Session
    $scope.reviewTime = false;

    $scope.isUserReview = function(review) {
        return review.user._id === $scope.session.user._id
    }

    $scope.removeReview = function(review) {
        if($scope.session.user._id === review.user._id) {
           ReviewsFactory.deleteReview(review._id)
           $scope.reviews = ReviewsFactory.fetchReviewsCache()
        }
    }

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

        ReviewsFactory.createReview($scope.newReviewModel)
        .then(function(reviewsCache) {
            $scope.reviewTime = false;
            $scope.reviews = reviewsCache;
            $scope.showReviewForm = false;
        })
    }
    $scope.hasReviews = function() {
        return $scope.reviews.length > 0;
    }

    $scope.showReviewForm = function() {
        $scope.reviewTime = !$scope.reviewTime
    }

    $scope.averageRating = function() {
        if($scope.reviews.length === 1) return $scope.reviews[0].rating
        var sum = 0;
        for (var i = 0; i < $scope.reviews.length; i++) {
            sum += $scope.reviews[i].rating;
        }
        return sum / $scope.reviews.length;
    }

    $scope.userHasReview = function() {
        if(!$scope.session.user) return false;
        $scope.reviews = ReviewsFactory.fetchReviewsCache();
        return ($scope.reviews.filter(function(review) {
            return review.user._id === $scope.session.user._id
        })).length > 0;

    }
});