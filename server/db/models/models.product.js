'use strict';
var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String
        // @OP
        // enum maybe ???
        // also, just one category?
    },
    price: {
        type: Number
        // @OP
        // keep this in cents (to avoid floating point problems)
        // also required
    },
    description: {
        type: String
        // @OP
        // maybe consider minlength?
    },
    images: [{
      // @OP
      // checkout s3 instead of saving buffer in db
      type: Buffer,
      extension: String, // @OP this field does not make sense
      select: false,
      url: String // @OP this field does not make sense
    }],
    numRemaining: {
      type: Number
      // @OP
      // default: 0
    }
});

// @OP
// consider methods/virtuals, e.g. .getAverageRating?

productSchema.pre('save', function (next) {
    var self = this;
    this.images.forEach(function(image, idx) {
        if (!image.url) image.url = 'api/products/' + self._id + "/" + idx + '.image';
        // @OP
        // this will not work by itself
    })
    next();
});

mongoose.model('Product', productSchema);
