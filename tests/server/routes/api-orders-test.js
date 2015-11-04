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


xdescribe('Orders Route', function () {

  beforeEach('Establish DB connection', function (done) {
    if (mongoose.connection.db) return done();
    mongoose.connect(dbURI, done);
  });

    var guestAgent;
    var user;
    var orderA;
    var orderB;
  
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
    .then(function (order) {
      orderA = order;
      return Order.create({
        user: user._id
      });
    })
    .then(function (order) {
      orderB = order;
      done();
    });
  });

  afterEach('Clear test database', function (done) {
    clearDB(done);
  });

  describe('GET all orders', function () {

    it('Should return all orders', function (done) {
      guestAgent.get('/api/orders')
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(2);
        done();
      });
    });
  });

  describe('GET one order', function () {

    it('Should return one order with the specified ID', function (done) {
      guestAgent.get('/api/orders/' + orderA._id)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body._id).to.equal(orderA._id + '');
        done();
      });
    });
  });

  describe('POST an order', function () {

    it('Should create a new order', function (done) {
      guestAgent.post('/api/orders')
      .send({
        user: user._id
      })
      .expect(201)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('Created');
        return Order.find({}).exec()
        .then(function (orders) {
          expect(orders.length).to.equal(3);
          done();
        })
      });
    });
  });

  describe('PUT an order', function () {

    it('Should modify a single order', function (done) {
      guestAgent.put('/api/orders/' + orderA._id)
      .send({
        user: user._id,
        status: 'Processing'
      })
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('Processing');
        done();
      });
    });
  });

  describe('DELETE an order', function () {

    it('Should delete a single order', function (done) {
      guestAgent.delete('/api/orders/' + orderA._id)
      .expect(204)
      .end(function (err, res) {
        if (err) return done(err);
        return Order.find({}).exec()
        .then(function (orders) {
          expect(orders.length).to.equal(1);
          done();
        })
      });
    });
  });
});