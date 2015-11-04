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
        type: String
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

// Won't work yet
productSchema.pre('save', function (next) {
    var self = this;
    this.images.forEach(function(image, idx) {
        if (!image.url) image.url = 'api/products/' + self._id + "/" + idx + '.image';
    })
    next();
});

mongoose.model('Product', productSchema);
