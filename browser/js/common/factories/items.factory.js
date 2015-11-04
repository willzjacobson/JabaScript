app.factory('ItemsFactory', function($http) {
	function toData(res) {
		return res.data;
	}
	var ItemsFactory = {
		getItems: function() {
			return $http.get('/api/items')
			.then(toData);
		},
		getOneItem: function(id) {
			return $http.get('/api/items/' + id)
			.then(toData);
		},
		createItem: function(itemData) {
			return $http.post('/api/items', itemData)
			.then(toData);
		},
		updateItem: function(id, itemData) {
			return $http.put('/api/items/' + id, itemData)
			.then(toData);
		},
		deleteItem: function(id) {
			return $http.delete('/api/items/' + id);
		}
	}
	return ItemsFactory;
})