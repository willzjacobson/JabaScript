var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');

var Item = mongoose.model('Item');
Promise.promisifyAll(mongoose);

module.exports = router;

router.get('/', function(req, res, next) {
  Item.find({})
  .then(function(items) {
    res.json(items);
  })
  .then(null, next);
});

router.post('/', function(req, res, next) {
  Item.create(req.body)
  .then(function(item) {
    res.status(201).json(item);
  })
  .then(null, next);
});

router.get('/:itemId', function(req, res, next) {
  Item.findById(req.params.id)
  .then(function(item) {
    res.json(item);
  })
  .then(null, next);
});

// MIGHT BE BROKEN
router.put('/:itemId', function(req, res, next) {
  req.item.set(req.body);
  req.item.save()
  .then(function(item){
    res.json(item);
  })
  .then(null, next);
});

router.delete('/:itemId', function(req, res, next) {
  Item.findByIdAndRemove(req.item._id)
  .then(function(item){
    res.json(item);
  })
  .then(null,next);
});
