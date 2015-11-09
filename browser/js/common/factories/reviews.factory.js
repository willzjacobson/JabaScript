app.factory('ReviewsFactory', function($http) {
	function toData(res) {
		return res.data;
	}

	var reviewsCache = [];

	var ReviewsFactory = {
		getReviews: function() {
			return $http.get('/api/reviews')
			.then(toData)
		},
		getOneReview: function(id) {
			return $http.get('/api/reviews/' + id)
			.then(toData);
		},
		createReview: function(reviewData) {
			return $http.post('/api/reviews', reviewData)
			.then(function(res) {
				reviewsCache.push(res.data);
				return reviewsCache;
			});
		},
		updateReview: function(id, reviewData) {
			return $http.put('/api/reviews/' + id, reviewData)
			.then(function(res) {
				for (var i = 0; i < reviewsCache.length; i++) {
					if (reviewsCache[i]._id === id) {
						reviewsCache[i] = res.data;
						return res.data;
					}
				}
			});
		},
		deleteReview: function(id) {
			return $http.delete('/api/reviews/' + id)
			.then(function(res) {
				reviewsCache = reviewsCache.filter(function(review) {
					return review._id !== id;
				})
			})
		},
		fetchReviewsCache: function() {
			return reviewsCache;
		},
		setReviewsCache: function(cache) {
			reviewsCache = cache
		},
		getReviewsForProduct: function(productId) {
			return $http.get('/api/products/' + productId + '/reviews')
			.then(function(res) {
				angular.copy(res.data, reviewsCache);
				return reviewsCache;
			});
		}
	}
	return ReviewsFactory;
})
