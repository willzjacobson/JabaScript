app.factory('UsersFactory', function($http) {
	function toData(res) {
		return res.data;
	}
	var UsersFactory = {
		getUsers: function() {
			return $http.get('/api/users')
			.then(toData);
		},
		getOneUser: function(id) {
			return $http.get('/api/users/' + id)
			.then(toData);
		},
		createUser: function(userData) {
			return $http.post('/api/users', userData)
			.then(toData);
		},
		updateUser: function(id, userData) {
			return $http.put('/api/users/' + id, userData)
			.then(toData);
		},
		deleteUser: function(id) {
			return $http.delete('/api/users/' + id);
		},
		getUserReviews: function (id) {
			return $http.get('/api/users/' + id + '/reviews')
			.then(toData);
		},
		getUserOrders: function (id) {
			return $http.get("/api/users/"+id+"/orders")
			.then(toData);
		}
	}
	return UsersFactory;
})