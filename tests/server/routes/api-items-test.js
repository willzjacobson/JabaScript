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

  var guestAgent;
  var product;
  var itemA;
  var itemB;

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
    .then(function (item) {
      itemA = item;
      return Item.create({
        product: product._id
      });
    })
    .then(function (item) {
      itemB = item;
      done();
    });
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('GET all items', function () {

    it('Should return all items', function (done) {
      guestAgent.get('/api/items')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        done();
      });
    });
  });

  describe('GET one item', function () {

    it('Should return one item with the specified ID', function (done) {
      guestAgent.get('/api/items/' + itemA._id)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.equal(itemA._id + '');
        done();
      });
    });
  });

  describe('POST an item', function () {

    it('Should create a new item', function (done) {
      guestAgent.post('/api/items')
      .send({
        product: product._id
      })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.quantity).to.equal(1);
        return Item.find({}).exec()
        .then(function (items) {
          expect(items.length).to.equal(3);
          done()
        })
        .then(null, done);
      });
    });
  });

  describe('PUT an item', function () {

    it('Should modify a single item', function (done) {
      guestAgent.put('/api/items/' + itemA._id)
      .send({
        quantity: 2
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.quantity).to.equal(2);
        done();
      });
    });
  });

  describe('DELETE an item', function () {

    it('Should delete a single item', function (done) {
      guestAgent.delete('/api/items/' + itemA._id)
      .expect(204)
      .end(function (err, res) {
        if (err) return done(err);
        return Item.find({}).exec()
        .then(function (items) {
          expect(items.length).to.equal(1);
          done();
        })
        .then(null, done);
      });
    });
  });

});