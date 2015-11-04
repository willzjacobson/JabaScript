'use strict';

var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
  product: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Product',
		required: true
  },
  quantity: {
		type: Number,
		default: 0,
		required: true
  },
  priceWhenOrdered: {
		type: Number,
		required: true

  }
});

mongoose.model('Item', itemSchema);
