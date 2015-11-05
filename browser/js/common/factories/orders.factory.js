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
		},
		getOrderItems: function (id) {
			return $http.get('/api/orders/' + id + '/items')
			.then(toData);
		},
		updateOrderItem: function (orderId, itemId, itemData) {
			return $http.put('/api/orders/' + orderId + '/items/' + itemId, itemData)
			.then(toData);
		},
		deleteOrderItem: function(orderId, itemId) {
			return $http.delete('/api/orders/' + orderId + '/items/' + itemId);
		},
		createOrderItem: function(orderId, itemData) {
			return $http.put('/api/orders/' + orderId + '/items', itemData)
			.then(toData);
		}
	};
	return OrdersFactory;
});