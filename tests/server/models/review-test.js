var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var sinon = require('sinon');
var expect = require('chai').expect;
var mongoose = require('mongoose');

// Require in all models.
require('../../../server/db/models');

var Review = mongoose.model('Review');
var Product = mongoose.model('Product');
var User = mongoose.model('User');

xdescribe('Review model', function () {

    beforeEach('Establish DB connection', function (done) {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach('Clear test database', function (done) {
        clearDB(done);
    });

    it('should exist', function () {
        expect(Review).to.be.a('function');
    });

      

    describe('on creation', function () {

        var encryptSpy;
        var saltSpy;

    	var testProduct;
		beforeEach("Create a product", function (done) {
			Product.create({name:"testProduct"})
			.then(function(product){
				testProduct = product;
				done();
			})
		})			

		var testUser;
		beforeEach("Create a user", function (done) {
			User.create({
				email: "user@gmail.com"
			})
			.then(function(user){
				testUser = user;
				done();
			}, function(err){
				done();
			})
		})

		var testReview1;
		var testReview2;
		beforeEach("Creates 2 reviews", function (done) {
			Review.create({
				user: testUser._id,
				product: testProduct._id,
				content: "I am a review of testProduct written by testUser"
			}, {
				user: testUser._id,
				product: testProduct._id,
				content: "I am the second review written by the same person on the same thing"
			})
			.then(function(reviews){
				console.log(reviews);
				testReview1 = reviews[0];
				testReview2 = reviews[1];
				done();
			}, function(err){
				done();
			})
		})

		it('is created when we give right params', function (done) {
			Review.find({})
			.then(function(reviews) {
				expect(reviews.length).to.equal(2);
				done();
			}, function(err) {
				done();
			});
		});

		it('it is not created when we give fake user reference', function() {
			Review.create({
				user: 'sdcdscscwe22',
				product: testProduct._id,
				content: "I'm about nothing written by nobody; I shouldn't be"
			})
			.then(function(review) {
				done();
			}, function(err) {
				expect(err).to.exist;
                done();
			})
		});

		it('it is not created when we give fake product reference', function() {
			Review.create({
				user: testUser._id,
				product: 'sdcdscscwe22',
				content: "I'm about nothing written by nobody; I shouldn't be"
			})
			.then(function(review) {
				done();
			}, function(err) {
				expect(err).to.exist;
                done();
			})
		});

		it('it is not created when the content is too short', function() {
			Review.create({
				user: testUser._id,
				product: testProduct._id,
				content: "I'm too short"
			})
			.then(function(review) {
				done();
			}, function(err) {
				expect(err).to.exist;
                done();
			})
		});


        xit('should call User.encryptPassword with the given password and generated salt', function (done) {
            createUser().then(function () {
                var generatedSalt = saltSpy.getCall(0).returnValue;
                expect(encryptSpy.calledWith('potus', generatedSalt)).to.be.ok;
                done();
            });
        });

        xit('should set user.salt to the generated salt', function (done) {
           createUser().then(function (user) {
               var generatedSalt = saltSpy.getCall(0).returnValue;
               expect(user.salt).to.be.equal(generatedSalt);
               done();
           });
        });

        xit('should set user.password to the encrypted password', function (done) {
            createUser().then(function (user) {
                var createdPassword = encryptSpy.getCall(0).returnValue;
                expect(user.password).to.be.equal(createdPassword);
                done();
            });
        });

        xit('should set isAdmin is false by default', function (done) {
        	createUser().then(function (user) {
        		expect(user.isAdmin).to.be.equal(false);
        		done();
        	})
        })

    });

});