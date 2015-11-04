var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');

var Order = mongoose.model('Order');
Promise.promisifyAll(mongoose);

module.exports = router;

router.get('/', function(req, res, next) {
  Order.find({}).populate("user items")
  .then(function(orders) {
    res.json(orders);
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

router.get('/:id', function(req, res, next) {
  Order.findById(req.params.id).populate("user items")
  .then(function(order) {
    res.json(order);
  })
  .then(null, next);
});

router.put('/:id', function(req, res, next) {
  Order.findByIdAndUpdate(req.params.id, req.body, {new: true}).populate("user items")
  .then(function(order) {

    console.log(order.user._id);
    res.status(200).json(order);
  })
  .then(null, next);
});

router.delete('/:id', function(req, res, next) {
  Order.remove({_id: req.params.id}).populate("user items")
  .then(function() {
    res.status(204).end();
  })
  .then(null, next);
});