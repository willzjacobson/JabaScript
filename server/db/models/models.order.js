'use strict';
var mongoose = require('mongoose');

var statuses = ['Created', 'Processing', 'Cancelled', 'Completed'];

var orderSchema = new mongoose.Schema({
    status: {
      type: String,
      enum: statuses,
      default: 'Created',
      required: true
    },
    dateIssued: {
      type: Date,
      default: Date.now,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }],
    shippingDetails: {
      type: String
    }
});

mongoose.model('Order', orderSchema);
