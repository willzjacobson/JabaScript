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

xdescribe('Users Route', function () {

	beforeEach('Establish DB connection', function (done) {
		if (mongoose.connection.db) return done();
		mongoose.connect(dbURI, done)
	});

	var testUser;
	beforeEach("Create a random user", function (done) {
		User.create({email:"test@gmail.com"})
		.then(function(user){
			testUser = user;
			done();
		});
	})

	afterEach('Clear test database', function (done) {
		clearDB(done);
	});

	describe('Unauthenticated request', function () {

		var guestAgent;
		beforeEach('Create guest agent', function () {
			guestAgent = supertest.agent(app);
		}); 

		describe("core user info", function(){

			it("gets all users", function (done) {
				guestAgent.get("/api/users")
				.expect(200)
				.end(function(err,response){
					expect(response.body).to.exist;
					expect(response.body[0].email).to.equal("test@gmail.com");
					done();
				});
			})

			it("creates a user", function (done) {
				guestAgent.post("/api/users")
				.send({email:"email@gmail.com"})
				.expect(201)
				.end(function (err, response) {
					expect(response.body).to.exist;
					expect(response.body.email).to.equal("email@gmail.com");
					done();

				})
			})

			it("finds a user by id", function (done) {
				guestAgent.get("/api/users/" + testUser._id)
				.expect(200)
				.end(function (err, response){
					expect(response.body.email).to.equal("test@gmail.com");
					done();
				});
			})

			xit('should get a 401 response', function (done) {
				guestAgent.get('/api/members/secret-stash')
					.expect(401)
					.end(done);
			});
		});

		describe("user and other model cofunctionality", function(){
			var testProduct;
			beforeEach("Create a product", function (done) {
				Product.create({name:"testProduct"})
				.then(function(product){
					testProduct = product;
					done();
				})
			})			

			var testReview;
			beforeEach("Create a review", function (done) {
				Review.create({
					product: testProduct._id,
					user: testUser._id,
					content: "My fake review! Silly minlength checker"
				})
				.then(function(review){
					testReview = review;
					done();
				}, function(err){
					done();
				})
			})

			it("finds a users reviews", function (done) {
				guestAgent.get("/api/users/" + testUser._id + "/reviews")
				.expect(200)
				.end(function (err, response) {
					expect(response.body.length).to.equal(1);
					done();
				})
			})

		})




	});

	describe('Authenticated request', function () {

		var loggedInAgent;

		var userInfo = {
			email: 'joe@gmail.com',
			password: 'shoopdawoop',
			isAdmin: true
		};
		var loggedInUserId;
		beforeEach('Create a user', function (done) {
			User.create(userInfo, done)
			.then(function(user){
				loggedInUserId = user._id;
			});
		});

		beforeEach('Create loggedIn user agent and authenticate', function (done) {
			loggedInAgent = supertest.agent(app);
			loggedInAgent.post('/login').send(userInfo)
			.end(function (err, response){
				// if (err) console.log("I have erred");
				// else console.log("We have a response");
				done()
			});
		});

		it('should put with a 200 status', function (done) {
			loggedInAgent
			.put("/api/users/"+ testUser._id)
			.send({email: "updated@gmail.com"})
			.expect(200)
			.end(function (err, response) {
				expect(response.body.email).to.equal("updated@gmail.com");
				done();
			})
		})

		it("should delete with a 200 status", function (done) {
			loggedInAgent
			.delete("/api/users/"+ testUser._id)
			.expect(200)
			.end(function (err, response) {
				expect(response.body.email).to.equal("test@gmail.com");
				done();			
			})
		})

		it("it should allow a user to log in with the right password", function (done) {
			loggedInAgent
			.post("/login")
			.send(userInfo)
			.end(function (err, response){
				expect(response.status).to.equal(200);
				if (err) console.log("There was an error!");
				else {
					// console.log("Our response info is: ", response);
				}
				done();
			})
		})		

		xit("it should not allow a user to log in with the wrong password", function (done) {
			loggedInAgent
			.post("/login")
			.send({
			email: 'joe@gmail.com',
			password: 'badPW'
			})
			.end(function (err, response){
				expect(response.status).to.equal(401);
				if (err) {
					// console.log("There was an error!");
				}
				else {
					// console.log("Our response info is: ", response);
				}
				done();
			})
		})

		xit('should get with 200 response and with an array as the body', function (done) {
			loggedInAgent.get('/api/members/secret-stash').expect(200).end(function (err, response) {
				if (err) return done(err);
				expect(response.body).to.be.an('array');
				done();
			});
		});

		it("should delete with a 200 status", function (done) {
			console.log("req.ourUser")
			loggedInAgent
			.delete("/api/users/"+ loggedInUserId)
			.expect(200)
			.end(function (err, response) {
				expect(response.body.email).to.equal("joe@gmail.com");
				done();			
			})
		})

	});

});