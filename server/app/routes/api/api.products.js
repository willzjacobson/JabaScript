var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');

var Product = mongoose.model('Product');
Promise.promisifyAll(mongoose);

module.exports = router;

router.get('/', function(req, res, next) {
  Product.find({})
  .then(function(products) {
    res.json(products);
  })
  .then(null, next);
});

router.get('/:id', function(req, res, next) {
  Product.findById(req.params.id)
  .then(function(product) {
    res.json(product);
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

router.put('/:id', function(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).end()
  }
  else {
    Product.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then(function(product) {
      res.status(200).json(product);
      console.info("We updated");
    })
    .then(null, next);  
  }
});

router.delete('/:id', function(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    res.status(401).end()
  }
  else {
    Product.remove({_id: req.params.id})
    .then(function() {
      res.status(204).end();
    })
    .then(null, next); 
  }
});
