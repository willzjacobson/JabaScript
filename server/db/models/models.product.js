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
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    images: [{
      type: Buffer,
      extension: String,
      select: false,
      url: String
    }],
    numRemaining: {
      type: Number
    }
});

schema.pre('save', function (next) {
    var self = this;
    this.images.forEach(function(image, idx) {
        if (!image.url) image.url = 'api/products/' + self._id + "/" + idx + '.image';
    })
    next();
});

mongoose.model('Product', productSchema);
