app.factory('OrdersFactory', function($http) {
	function toData(res) {
		return res.data;
	}
	var OrdersFactory = {
		getOrders: function() {
			return $http.get('/api/orders')
			.then(toData);
		},
		getOneOrder: function(id) {
			return $http.get('/api/orders/' + id)
			.then(toData);
		},
		createOrder: function(orderData) {
			return $http.post('/api/orders', orderData)
			.then(toData);
		},
		updateOrder: function(id, orderData) {
			return $http.put('/api/orders/' + id, orderData)
			.then(toData);
		},
		deleteOrder: function(id) {
			return $http.delete('/api/orders/' + id);
		}
	}
	return OrdersFactory;
})