app.factory('EmailFactory', function ($http) {
	return {
		sendEmail: function (params) {
			return $http.post('/api/email', params)
			.then(function (res) {
				return res.data;
			});
		}
	}
});