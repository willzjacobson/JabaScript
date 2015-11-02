var router = require('express').Router();
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Product = require(__dirname + 'server/db/models').Product;
Promise.promisify(mongoose);

console.log(Product)

module.exports = router;

router.get('/', function(req, res, next) {

});

router.get('/:id', function(req, res, next) {

});

router.post('/', function(req, res, next) {

});

router.put('/:id', function(req, res, next) {

});

router.delete('/:id', function(req, res, next) {

});
