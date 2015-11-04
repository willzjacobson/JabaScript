var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');

var Order = mongoose.model('Order');
Promise.promisifyAll(mongoose);

module.exports = router;

router.get('/', function(req, res, next) {
  Order.find({})
  .then(function(orders) {
    res.json(orders);
  })
  .then(null, next);
});

router.param("id", function (req, res, next, id){

})

router.param("userId", function (req, res, next, userId){
  User.findById(userId)
  .then(function(user){
    req.user = user;
    if (req.ourUser) req.ourUser.hasPermission = req.ourUser.isAdmin || req.ourUser._id.equals(user._id);
    if (req.ourUser) console.log("req.ourUser.hasPermission: ",req.ourUser.hasPermission);
    next();
  })
  .then(null,next);
})

router.get('/:id', function(req, res, next) {
  Order.findById(req.params.id).populate("")
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
    res.status(200).json(order);
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

router.put("/:orderId/items/:itemId") {
  if hasPermission 
    Item.put(GFDGDFG)
}