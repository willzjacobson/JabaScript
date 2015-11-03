var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Order = mongoose.model('Order');
var User = mongoose.model('User');
var Product = mongoose.model('Product');
var Item = mongoose.model('Item');

describe('Order model', function () {
	// returns promise for a test order
	// accepts configuration object "options"
	var createOrder = function (options) {
        return Order.create({
        	user: options.userId,
        	details: {$push: options.details}
        });
	};
	// returns promise for a test user
	var createUser = function () {
		return User.create({
			email: 'jane@doe.com',
			password: 1234
		});
	};
	// returns promise for a test product
	var createProduct = function () {
        return Product.create({
        	name: 'Blue Lightsaber',
        	category: 'Weapons',
        	price: 2000,
        	description: 'Be careful! This is a very dangerous but super awesome weapon!'
        });
	};

	var createItem = function (product) {
		return Item.create({
			product: product._id,
			priceWhenOrdered: product.price
		});
	};

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });


    it('should exist', function () {
        expect(Order).to.be.a('function');
    });

    it("should have the default fields when those fields aren't specified", function (done) {
    	var user;
    	var product;
    	createUser()
    	.then(function (user) {
    		user = user;
    		return createOrder({userId: user._id});
    	})
    	.then(function (order) {
    		expect(order).to.have.property('status', 'Created');
    		expect(order).to.have.property('dateIssued');
            done();
    	});
    });

    it("should be able to assign children to an order", function (done) {
    	var user;
    	var product;
      var item;

    	createUser()
    	.then(function (newUser) {
    		user = newUser;
    		return createProduct();
    	})
			.then(function (newProduct) {
				product = newProduct;
				return createItem(product);
			})
			.then(function (newItem) {
				item = newItem;
				return createOrder({
					userId: user._id,
				});
			})
    	.then(function (order) {
				order.items.push(item._id);
				return order.save();
			})
			.then(function (order) {
				console.log('the order', order);
        expect(order.items.length).to.equal(1);
				done();
    	})
			.then(null, function (err) {
				console.log('An error occurred', err);
			});
    });
});
