'use strict';
var mongoose = require('mongoose');

var minlength = [20, "The length is shorter than the minimum required length"];

var reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        minlength: minlength,
        required: true
    },
    rating: {
        type: Number,
        max: 5,
        min: 1,
        required: true
    }
});

mongoose.model('Review', reviewSchema)
