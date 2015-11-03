// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Product = mongoose.model('Product');
var Item = mongoose.model('Item');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');


describe('Items Route', function () {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('GET all items', function () {
    var guestAgent;
    var product;

    beforeEach('Create guest agent', function (done) {
      guestAgent = supertest.agent(app);
      return Product.create({
        name: 'Purple Lightsaber',
        category: 'Weapons',
        price: 2000,
        description: 'Great at killing snakes on planes'
      })
      .then(function (newProduct) {
        product = newProduct;
        return Item.create({
          product: product._id
        });
      })
      .then(function () {
        done();
      });
    });

    it('Should return all items', function (done) {
      guestAgent.get('/api/items').expect(200).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
    });
  });
});
