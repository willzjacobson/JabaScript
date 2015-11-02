'use strict';
var router = require('express').Router();
module.exports = router;

// router.use('/users', require('./api.users'));
router.use('/products', require('./api.products'));
router.use('/orders', require('./api.orders'));
// router.use('/reviews', require('./api.reviews'));
