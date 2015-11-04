app.factory('ReviewsFactory', function($http) {
	function toData(res) {
		return res.data;
	}
	var ReviewsFactory = {
		getReviews: function() {
			return $http.get('/api/reviews')
			.then(toData);
		},
		getOneReview: function(id) {
			return $http.get('/api/reviews/' + id)
			.then(toData);
		},
		createReview: function(reviewData) {
			return $http.post('/api/reviews', reviewData)
			.then(toData);
		},
		updateReview: function(id, reviewData) {
			return $http.put('/api/reviews/' + id, reviewData)
			.then(toData);
		},
		deleteReview: function(id) {
			return $http.delete('/api/reviews/' + id);
		}
	}
	return ReviewsFactory;
})