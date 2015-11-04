var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');

var Order = mongoose.model('Order');
Promise.promisifyAll(mongoose);

router.get('/', function(req, res, next) {
  Order.find({})
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

router.param('orderId', function(req, res, next, orderId) {
  Order.findById(orderId)
  .then(function(order) {
    req.order = order;
    next();
  })
  .then(null, next);
})

router.get('/:orderId', function(req, res, next) {
  res.json(req.order);
});

router.put('/:orderId', function(req, res, next) {
  req.order.set(req.body);
  req.order.save()
  .then(function(order){
    res.json(order);
  })
  .then(null, next);
});

router.delete('/:orderId', function(req, res, next) {
  Order.findByIdAndRemove(req.order._id)
  .then(function(order){
    res.json(order);
  })
  .then(null,next);
});

//FIXME
// Get all the items in an order
// router.get("/:orderId/items", function (req, res, next){
//   Item.find({order: req.order._id})
//   .then(function (reviews) {
//     res.json(reviews)
//   })
//   .then(null, next);
// });

module.exports = router;