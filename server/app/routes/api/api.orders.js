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

router.post('/', function(req, res, next) {
  Order.create(req.body)
  .then(function(order) {
    if (Object.keys(req.body).length === 0) req.session.cart = order;
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
    var orderSum = order.items.reduce(function(sum,item){
      return sum + item.quantity * item.priceWhenOrdered;
    },0)
    req.order.totalPrice = orderSum;    
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

router.put("/:orderId/items/", function (req, res, next) {
  var theItem;
  var theOrder;
  Item.create(req.body)
  .then(function(item) {
    return Item.findById(item._id).populate('product');
  })
  .then(function (item) {
    theItem = item;
    req.order.items.push(item)
    return req.order.save()
  })
  .then(function(order) {
    theOrder = order;
    if (!req.user) return theItem.populate('product');
    else return order;
  })
  .then(function () {
    if (!req.user) {
      theOrder.items = theOrder.items.map(function (item) {
        if (!item.product.name) return theItem;
        else return item;
      });
      return theOrder.save()
    } else return theOrder;
  })
  .then(function (order) {
    req.session.cart = order;
    res.status(201).json(theOrder)
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
router.delete("/:orderId/items/:itemId", function (req, res, next) {
  if (req.session.cart) {
    for (var i = 0; i < req.session.cart.items.length; i++) {
      req.session.cart.items = req.session.cart.items.filter(function (item) {
        return item._id.toString() !== req.item._id.toString()
      });
    }
  }
  return req.item.remove()
  .then(function() {
    res.status(204).send()
  })
  .then(null, next)
});

//Empties a given order
router.delete("/:orderId/items/", function (req, res, next) {
  var removingItems = [];

  req.order.items.forEach(function(item){
    removingItems.push(Item.findByIdAndRemove(item._id));
  })
  Promise.all(removingItems)
  .then(function(success){
    req.session.cart = null;
    res.status(204).send(success)
  })
  .then(null, next);
})


module.exports = router;

