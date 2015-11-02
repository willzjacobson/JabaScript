'use strict';
var mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    name: {
        type: String
    },
    type: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    images: {
      type: [String]
    },
    numRemaining: {
      type: Number
    }

});


module.exports = mongoose.model('Product', productSchema);
