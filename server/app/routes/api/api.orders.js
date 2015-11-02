var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');

var order = mongoose.model('Order');
Promise.promisifyAll(mongoose);

module.exports = router;

router.get('/', function(req, res, next) {
  Order.find({})
  .then(function(orders) {
    res.json(orders);
  })
  .then(null, next);
});

router.get('/:id', function(req, res, next) {
  Order.findById(req.params.id)
  .then(function(order) {
    res.json(order);
  })
  .then(null, next);
});

router.post('/', function(req, res, next) {
  Order.create(req.body)
  .then(function(order) {
    res.status(201).json(order);
  })
  .then(null, next);
});

router.put('/:id', function(req, res, next) {
  Order.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(function(order) {
    res.status(204).json(order);
  })
  .then(null, next);
});

router.delete('/:id', function(req, res, next) {
  Order.remove({_id: req.params.id})
  .then(function() {
    res.status(204).end();
  })
  .then(null, next);
});
