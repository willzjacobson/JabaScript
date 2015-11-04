app.factory('ProductsFactory', function($http) {
	function toData(res) {
		return res.data;
	}
	var ProductsFactory = {
		getProducts: function() {
			return $http.get('/api/products')
			.then(toData);
		},
		getOneProduct: function(id) {
			return $http.get('/api/products/' + id)
			.then(toData);
		},
		createProduct: function(productData) {
			return $http.post('/api/products', productData)
			.then(toData);
		},
		updateProduct: function(id, productData) {
			return $http.put('/api/products/' + id, productData)
			.then(toData);
		},
		deleteProduct: function(id) {
			return $http.delete('/api/products/' + id);
		}
	}
	return ProductsFactory;
})