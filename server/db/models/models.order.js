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
      ref: 'User',
      required: true
    },
    // toObject: {virtuals: true },
    // toJSON: {virtuals: true},
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }]
});

//TODO We don't know if this works; test when we have a front end
orderSchema.methods.getTotalPrice = function()  {
  var promiseForItems = this.items.map(function(itemId) {
    return mongoose.model('Item').find({_id: this._id});
  })
  return Promise.all(promiseForItems).then(function(theItems) {
    return theItems.reduce(function(current, next) {
      return (current.price * current.quantity)
      + (next.price * next.quantity)
    })
  })
}

// orderSchema.virtual('sumPrices').get(function() {
//   return this.getTotalPrice()
// })


mongoose.model('Order', orderSchema);
