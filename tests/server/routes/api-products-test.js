// Instantiate all models
var mongoose = require('mongoose');
require('../../../server/db/models');
var Product = mongoose.model('Product');

var expect = require('chai').expect;

var dbURI = 'mongodb://localhost:27017/testingDB';
var clearDB = require('mocha-mongoose')(dbURI);

var supertest = require('supertest');
var app = require('../../../server/app');

describe('Product Route', function () {
  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('GET all products', function () {
    var guestAgent;
    var product1;
    var product2;

    beforeEach('Create guest agent', function (done) {
      guestAgent = supertest.agent(app);
      return Product.create({
        name: 'Blue Lightsaber',
        category: 'Weapons',
        price: 2000,
        description: 'Be careful! This is a very dangerous but super awesome weapon!'
      })
      .then(function (newProduct) {
        product1 = newProduct;
        return Product.create({
          name: 'Purple Lightsaber',
          category: 'Weapons',
          price: 2000,
          description: 'Great at killing snakes on planes'
        });
      })
      .then(function (newProduct) {
          product2 = newProduct;
          done();
      });
    });

    it('Should return all products', function (done) {
      guestAgent.get('/api/products').expect(200).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
    });
  });
});
