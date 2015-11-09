app.factory('ProductsFactory', function($http) {
	function toData(res) {
		return res.data;
	}

	var productsCache = [];

	var ProductsFactory = {
		getProducts: function() {
			return $http.get('/api/products')
			.then(function (res) {
				angular.copy(res.data, productsCache);
				return productsCache;
			});
		},
		getOneProduct: function(id) {
			return $http.get('/api/products/' + id)
			.then(toData);
		},
		createProduct: function(productData) {
			return $http.post('/api/products', productData)
			.then(function (res) {
				productsCache.push(res.data);
				return res.data;
			});
		},
		updateProduct: function(id, productData) {
			return $http.put('/api/products/' + id, productData)
			.then(function (res) {
				for (var i = 0; i < productsCache.length; i++)
					if (productsCache[i]._id === id) productsCache[i] = res.data;
				return res.data;
			});
		},
		deleteProduct: function(id) {
			return $http.delete('/api/products/' + id)
			.then(function (res) {
				productsCache = productsCache.filter(function (product) {
					return product._id !== id;
				});
				return productsCache;
			});
		},
		deleteProductImage: function (productId, imageIdx) {
			return $http.put('/api/products/' + productId + '/image', {idx: imageIdx})
			.then(function(res) {
				for (var i = 0; i < productsCache.length; i++)
					if (productsCache[i]._id === productId) productsCache[i] = res.data;
				return res.data;
			});
		},
		fetchProductsCache: function () {
			return productsCache;
		}
	};
	return ProductsFactory;
});
