// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var User = mongoose.model('User');
var Review = mongoose.model('Review');
var Product = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/jabascript-test';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Reviews Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done)
	});

	var testUser;
	beforeEach("Create a random user", function (done) {
		return User.create({email:"test@gmail.com"})
		.then(function(user){
			testUser = user;
			done();
		});
	})

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
		})
		.then(function (review1) {
			testReview1 = review1;
			return Review.create({
				user: testUser._id,
				product: testProduct._id,
				content: "I am the second review written by the same person on the same thing"
			})
		})
		.then(function(review2){
			testReview2 = review2;
			done();
		}, function(err){
			done();
		})
	})

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Unauthenticated request', function () {

		var guestAgent;
		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		}); 

		describe("core review info", function(){

			it("gets all reviews", function (done) {
				guestAgent.get("/api/reviews")
				.expect(200)
				.end(function(err,response){
					expect(response.body).to.exist;
					expect(response.body.length).to.equal(2);
					expect(response.body[0].content).to.equal("I am a review of testProduct written by testUser");
					done();
				});
			})

			it("creates a review", function (done) {
				guestAgent.post("/api/reviews")
				.send({
					content: "I'm a really new review i say nothing meaningful",
					user: testUser._id,
					product: testProduct._id
				})
				.expect(201)
				.end(function (err, response) {
					expect(response.body).to.exist;
					expect(response.body.content).to.equal("I'm a really new review i say nothing meaningful");
					done();
				})
			})

			it("finds a review by id", function (done) {
				guestAgent.get("/api/reviews/" + testReview1._id)
				.expect(200)
				.end(function (err, response){
					expect(response.body).to.exist;
					expect(response.body.content).to.equal("I am a review of testProduct written by testUser");
					done();
				});
			})

			it("finds a review by id and populates user field", function (done) {
				guestAgent.get("/api/reviews/" + testReview1._id)
				.expect(200)
				.end(function (err, response){
					expect(response.body).to.exist;
					expect(response.body.user._id.toString()).to.equal(testUser._id.toString());
					expect(response.body.user.email).to.equal(testUser.email);
					done();
				});
			})

			it("finds a review by id and populates product field", function (done) {
				guestAgent.get("/api/reviews/" + testReview1._id)
				.expect(200)
				.end(function (err, response){
					expect(response.body).to.exist;
					expect(response.body.product._id.toString()).to.equal(testProduct._id.toString());
					expect(response.body.product.email).to.equal(testProduct.email);
					done();
				});
			})

			xit('should get a 401 response', function (done) {
				guestAgent.get('/api/members/secret-stash')
					.expect(401)
					.end(done);
			});
		});

	});

	describe('Authenticated request', function () {

		var loggedInAgent;

		var userInfo = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop',
			isAdmin: true
		};

		beforeEach('Create a user', function (done) {
			User.create(userInfo, done);
		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo).end(done);
		});

		it('should put a review with a 200 status', function (done) {
			loggedInAgent
			.put("/api/reviews/"+ testReview1._id)
			.send({content: "I am some updated content in testReview1"})
			.expect(200)
			.end(function (err, response) {
				expect(response.body).to.exist;
				expect(response.body.content).to.equal("I am some updated content in testReview1");
				done();
			})
		})

		it("should delete with a 200 status", function (done) {
			loggedInAgent
			.delete("/api/reviews/"+ testReview1._id)
			.expect(200)
			.end(function (err, response) {
				return Review.findById(testReview1._id)
				.then(function(review) {
					expect(review).to.not.exist;
					done();	
				})
				.then(null, done);		
			})
		})

		xit('should get with 200 response and with an array as the body', function (done) {
			loggedInAgent.get('/api/members/secret-stash').expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.be.an('array');
				done();
			});
		});

	});

});