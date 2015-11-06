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
    images: {
      type: [String],
      default: ['https://s3.amazonaws.com/jabbascript/deathstar.png']
    },
    numRemaining: {
      type: Number,
      default: 0
    }
});

productSchema.pre('save', function (next) {
  if (this.images.length === 0) this.images = ['https://s3.amazonaws.com/jabbascript/deathstar.png'];
  next();
})

productSchema.pre('save', function(next) {
  this.price = Number(this.price);
  this.quantity = Number(this.quantity);
  next();
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
