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

router.get('/:id', function(req, res, next) {
  Item.findById(req.params.id)
  .then(function(item) {
    res.json(item);
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

router.put('/:id', function(req, res, next) {
  console.log('req.body', req.body);
  Item.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(function(order) {
    res.status(200).json(item);
  })
  .then(null, next);
});

router.delete('/:id', function(req, res, next) {
  Item.remove({_id: req.params.id})
  .then(function() {
    res.status(204).end();
  })
  .then(null, next);
});
