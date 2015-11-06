app.factory('OrdersFactory', function($http) {
	function toData(res) {
		return res.data;
	}
	var orderCache = [];

	var OrdersFactory = {
		getOrders: function() {
			return $http.get('/api/orders')
			.then(function(res) {
				angular.copy(res.data, orderCache);
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
				var updatedOrder = res.data;
				for (var i = 0; i < orderCache.length; i++)
					if (orderCache[i]._id.toString() === id.toString()) orderCache[i] = updatedOrder;
				return updatedOrder;
			});
		},
		deleteOrder: function(id) {
			return $http.delete('/api/orders/' + id)
			.then(function() {
				orderCache = orderCache.filter(function(order) {
					return order._id.toString() !== id.toString();
				});
				return orderCache;
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
		},
		fetchOrderCache: function () {
			return orderCache;
		},
		emptyOrder: function(id) {
			return $http.delete("api/orders/" + id + "/items")
		},
		findOrderCost: function(order) {
		  return order.items.reduce(function(sum,item){
		    return sum + item.quantity * item.priceWhenOrdered;
		  },0)
		}
	};
	return OrdersFactory;
});