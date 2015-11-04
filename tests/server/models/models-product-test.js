var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Product = mongoose.model('Product');

describe('Product model', function () {
	// returns promise for a test product
	var createProduct = function (name) {
        return Product.create({
        	name: name,
        	category: 'Weapons',
        	price: 2000,
        	description: 'Be careful! This is a very dangerous but super awesome weapon!'
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
        expect(Product).to.be.a('function');
    });

    it('should have a name field', function (done) {
    	createProduct('Blue Lightsaber')
    	.then(function (product) {
    		expect(product).to.have.property('name');
    		done();
    	});
    });

    it('should not allow products with duplicate names', function (done) {
    	createProduct('Blue Lightsaber')
    	.then(function (product) {
    		createProduct('Blue Lightsaber');
				done();
    	})
    	.then(null, function (err) {
    		expect(err).to.exist();
    		done();
    	});
    });
});
