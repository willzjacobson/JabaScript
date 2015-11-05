'use strict';
var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: [String]
        //TODO Add enum: [options]
    },
    price: {
        type: Number
    },
    description: {
        type: String,
        minlength: 20
    },
    images: [String],
    numRemaining: {
      type: Number,
      default: 0
    }
});

//TODO Test this once we have a front end to test it on.
productSchema.methods.getAverageRating = function()  {
  var numReviews;
  mongoose.model('Review').find({product: this._id})
  .then(function(theReviews) {
    numReviews = theReviews.length
    return theReviews.reduce(function(current, next) {
        return current.rating + next.rating;
    })
  })
  .then(function(ratingsTotal) {
    return ratingsTotal / length
  })
}

mongoose.model('Product', productSchema);
