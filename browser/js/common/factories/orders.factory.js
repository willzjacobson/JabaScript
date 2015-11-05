app.factory('OrdersFactory', function($http) {
	function toData(res) {
		return res.data;
	}
	var orderCache = [];
	var OrdersFactory = {
		getOrders: function() {
			return $http.get('/api/orders')
			.then(function(res) {
				orderCache = res.data;
				return orderCache;
			});
		},
		getOneOrder: function(id) {
			return $http.get('/api/orders/' + id)
			.then(toData);
		},
		createOrder: function(orderData) {
			return $http.post('/api/orders', orderData)
			.then(function(res) {
				var newOrder = res.data;
				orderCache.push(newOrder);
				return newOrder;
			});
		},
		updateOrder: function(id, orderData) {
			return $http.put('/api/orders/' + id, orderData)
			.then(function(res) {
				var updateOrder = res.data;
				orderCache.forEach(function(order) {
					if (order._id === updateOrder._id) order = updateOrder;
				});
				return updateOrder;
			});
		},
		deleteOrder: function(id) {
			return $http.delete('/api/orders/' + id)
			.then(function() {
				orderCache.filter(function(order) {
					return order._id !== id;
				});
			});
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