app.factory('UsersFactory', function($http) {
	function toData(res) {
		return res.data;
	}
	var usersCache = [];
	var UsersFactory = {
		getUsers: function() {
			return $http.get('/api/users')
			.then(function(res) {
				var users = res.data;
				angular.copy(users, usersCache);
				return usersCache;
			});
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
			.then(function(res) {
				var updatedUser = res.data;
				for (var i = 0; i < usersCache.length; i++) {
					if (usersCache[i]._id.toString() === id.toString()) {
						usersCache[i] = updatedUser;
						return updatedUser;
					}
				}
			});
		},
		deleteUser: function(id) {
			return $http.delete('/api/users/' + id)
			.then(function() {
				usersCache = usersCache.filter(function(user) {
					return user._id.toString() !== id.toString();
				})
				return usersCache;
			});
		},
		getUserReviews: function (id) {
			return $http.get('/api/users/' + id + '/reviews')
			.then(toData);
		},
		getUserOrders: function (id) {
			return $http.get("/api/users/"+id+"/orders")
			.then(toData);
		},
		fetchUsersCache: function () {
			return usersCache;
		}
	}
	return UsersFactory;
})