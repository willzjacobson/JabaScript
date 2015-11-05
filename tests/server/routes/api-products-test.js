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

  var guestAgent;
  var productA;
  var productB;

  beforeEach('Create guest agent', function (done) {
    guestAgent = supertest.agent(app);
    return Product.create({
      name: 'Blue Lightsaber',
      category: 'Weapons',
      price: 2000,
      description: 'Be careful! This is a very dangerous but super awesome weapon!'
    })
    .then(function (newProduct) {
      productA = newProduct;
      return Product.create({
        name: 'Purple Lightsaber',
        category: 'Weapons',
        price: 2000,
        description: 'Great at killing snakes on planes'
      });
    })
    .then(function (newProduct) {
        productB = newProduct;
        done();
    });
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('GET all products', function () {

    it('Should return all products', function (done) {
      guestAgent.get('/api/products').expect(200).end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
    });
  });

  describe('GET one product', function () {

    it('Should return one product with the specified ID', function (done) {
      guestAgent.get('/api/products/' + productA._id)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.equal(productA._id + '');
        done();
      });
    });
  });

  describe('POST an product', function () {

    it('Should create a new product', function (done) {
      guestAgent.post('/api/products')
      .send({
        name: "Red Lightsaber",
        category: "Weapons",
        price: 3000,
        description: "Sith lords only!"
      })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal("Red Lightsaber");
        return Product.find({}).exec()
        .then(function (products) {
          expect(products.length).to.equal(3);
          done();
        })
      });
    });
  });

  describe('PUT an product', function () {

    it('Should modify a single product', function (done) {
      guestAgent.put('/api/products/' + productA._id)
      .send({
        name: "Green Lightsaber"
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal("Green Lightsaber");
        done();
      });
    });
  });

  describe('DELETE an product', function () {

    it('Should delete a single product', function (done) {
      guestAgent.delete('/api/products/' + productA._id)
      .expect(204)
      .end(function (err, res) {
        if (err) return done(err);
        return Product.find({}).exec()
        .then(function (products) {
          expect(products.length).to.equal(1);
          done();
        });
      });
    });
  });

});