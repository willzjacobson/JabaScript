var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');

var Product = mongoose.model('Product');
Promise.promisifyAll(mongoose);

module.exports = router;

router.get('/', function(req, res, next) {
  console.log("Yo")
  Product.find({})
  .then(function(products) {
    res.json(products);
  })
  .catch(null, next);
});

router.get('/:id', function(req, res, next) {
  Product.findById(req.params.id)
  .then(function(product) {
    res.json(product);
  })
  .catch(null, next);
});

router.post('/', function(req, res, next) {
  console.log("YO WHAT UP QAT")
  Product.create(req.body)
  .then(function(product) {
    res.status(201).json(product);
  })
  .catch(null, next);
});

router.put('/:id', function(req, res, next) {
  Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(function(product) {
    res.status(204).json(product);
  })
  .catch(null, next);
});

router.delete('/:id', function(req, res, next) {
  Product.remove({_id: req.params.id})
  .then(function() {
    res.status(204).end();
  })
  .catch(null, next);
});
