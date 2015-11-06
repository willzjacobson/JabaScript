var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');

var Order = mongoose.model('Order');
var Item = mongoose.model('Item');
var Product = mongoose.model('Product');

Promise.promisifyAll(mongoose);

router.get('/', function(req, res, next) {
  var orders;
  Order.find({}).populate("user items")
  .then(function (theOrders) {
    var itemsArray = [];
    theOrders.forEach(function(order){
      order.items.forEach(function(item) {
        itemsArray.push(item)
      })
    })
    orders = theOrders
    return Product.populate(itemsArray, {path: 'product'})
  })
  .then(function () {
    res.json(orders);
  })
  .then(null, next);
});

//TODO make sure there is only one "Created" (active) order at a time
router.post('/', function(req, res, next) {
  Order.create(req.body)
  .then(function(order) {
    res.status(201).json(order);
  })
  .then(null, next);
});

router.param('orderId', function(req, res, next, orderId) {
  var order;
  Order.findById(orderId)
  .populate('user items')
  .then(function (theOrder) {
    order = theOrder;
    return Product.populate(theOrder.items, {path: 'product'})
  })
  .then(function() {
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
  req.order.remove()
  .then(function(order){
    res.status(204).json(order);
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
  req.item.set(req.body)
  req.item.save()
  .then(function(item) {
    res.status(200).json(item)
  })
  .then(null, next)
});

// deletes one item
router.delete("/:orderId/items/:itemId", function (req, res, next){
  req.item.remove()
  .then(function() {
    res.status(204).send()
  })
  .then(null, next)
});

//Empties a given order
router.delete("/:orderId/items/", function (req, res, next) {
  var removingItems = [];
  console.log("Items id", req.order.items);

  req.order.items.forEach(function(item){
    console.log("Item id", item._id);
    removingItems.push(Item.findByIdAndRemove(item._id));
  })
  Promise.all(removingItems)
  .then(function(success){
    res.status(204).send(success)
  })
  .then(null, next);
})


module.exports = router;

