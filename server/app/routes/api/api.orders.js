var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');

var Order = mongoose.model('Order');
var Item = mongoose.model('Item');
var Product = mongoose.model('Product');

Promise.promisifyAll(mongoose);

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

router.param('orderId', function(req, res, next, orderId) {
  Order.findById(orderId)
  .populate('items')
  .then(function(order) {
    req.order = order;
    next();
  })
  .then(null, next);
})

router.get('/:orderId', function(req, res, next) {
  res.json(req.order)
  .then(null, next)
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


// Get all the items in an order
router.get("/:orderId/items", function (req, res, next){
  var items = req.order.items;
  Product.populate(items, {path: 'product'}, function(err, theItems) {
    res.json(theItems)
  })
  .then(null, next)
});

router.put("/:orderId/items/", function (req, res, next){
  Item.create(itemId)
  .then(function(item) {
    req.order.items.push(item)
    return req.order.save()
  })
  .then(function(order) {
    res.status(201).json(order)
  })
  .then(null, next)
});

router.param("itemId", function (req, res, next, itemId){
  Item.findById(itemId)
  .then(function(item){
    req.item = item;
    next();
  })
  .then(null,function(err) {
    console.log(err)
  });
})

router.put("/:orderId/items/:itemId", function (req, res, next){
  Item.findByIdAndUpdate(req.item._id, req.body, {new: true})
  .then(function(item) {
    res.status(200).json(item)
  })
  .then(null, next)
});

router.delete("/:orderId/items/:itemId", function (req, res, next){
  Item.findByIdAndRemove(req.item._id)
  .then(function() {
    res.status(204).send()
  })
  .then(null, next)
});


module.exports = router;

