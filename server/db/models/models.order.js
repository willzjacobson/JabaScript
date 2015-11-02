'use strict';
var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
    status: {
        type: String, enum: ['Created', 'Processing', 'Cancelled', 'Completed'],
        default: 'Created'
    },
    dateIssued: {
      type: Date,
      default: Date.now
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    details: [{
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quanitity: Number
    }]


});

mongoose.model('Order', orderSchema);
