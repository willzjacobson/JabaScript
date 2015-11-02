'use strict';
var mongoose = require('mongoose');

var statuses = ['Created', 'Processing', 'Cancelled', 'Completed'];

var orderSchema = new mongoose.Schema({
  //FIXME We shouldn't be able to set the type to something that isn't an enum.
    status: {
      type: String, enum: statuses,
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
