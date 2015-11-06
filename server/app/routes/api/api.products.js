var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
var _ = require('lodash');

var Product = mongoose.model('Product');
Promise.promisifyAll(mongoose);


router.get('/', function(req, res, next) {
  Product.find({})
  .then(function(products) {
    res.json(products);
  })
  .then(null, next);
});

router.post('/', function(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).end()
  } else{
    Product.create(req.body)
    .then(function(product) {
      res.status(201).json(product);
      console.info("Post Successful");
    })
    .then(null, next);
  }
});

router.param('productId', function(req, res, next, productId) {
  Product.findById(productId)
  .then(function(product) {
    req.product = product;
    next();
  })
  .then(null, next);
})

router.get('/:productId', function(req, res, next) {
  res.json(req.product);
});

router.put('/:productId', function(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).end()
  }
  else {
    // todo: figure out why this isn't working; problem seems to be req.body.images.split
    if (req.body.category) req.body.category = req.body.category.split(',');
    if (req.body.images) req.body.images = req.body.images.split(',');
    console.log(req.body.images);
    req.product.set(req.body);

    req.product.save()
    .then(function(product){
      res.json(product);
    })
    .then(null, next);
  }
});

router.delete('/:productId', function(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).end()
  }
  else {
    req.product.remove()
    .then(function(product){
      res.status(204).json(product);
    })
    .then(null, next);
  }
});

module.exports = router;
