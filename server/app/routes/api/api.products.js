var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
var _ = require('lodash');

var Product = mongoose.model('Product');
var Review = mongoose.model('Review');
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

router.get('/:productId/reviews', function(req, res, next) {
  Review.find({product: req.product._id}).populate('user')
  .then(function(reviews) {
    res.json(reviews)
  })
  .then(null, next)
})

router.put('/:productId', function(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).end()
  }
  else {
    if (req.body.category) req.body.category = req.body.category.split(',');
    if (req.body.images) req.body.images = req.body.images.split(',');
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
