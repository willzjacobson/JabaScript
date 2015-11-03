// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Order = mongoose.model('Order');
var User = mongoose.model('User');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');


describe('Orders Route', function () {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('GET all orders', function () {
    var guestAgent;
    var user;

    beforeEach('Create guest agent', function (done) {
      guestAgent = supertest.agent(app);
      return User.create({
        email: 'jane@doe.com',
        password: 1234
      })
      .then(function (newUser) {
        user = newUser;
        return Order.create({
          user: user._id
        });
      })
      .then(function () {
        done();
      });
    });

    it('Should return all orders', function (done) {
      guestAgent.get('/api/orders').expect(200).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
    });
  });
});
