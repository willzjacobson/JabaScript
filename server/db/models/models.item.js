'use strict';

var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  quantity: {
    type: Number,
    default: 1
  },
  priceWhenOrdered: {
    type: Number
  }
});

mongoose.model('Item', itemSchema);
