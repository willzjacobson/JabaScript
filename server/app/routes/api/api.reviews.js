var router = require('express').Router();
var mongoose = require("mongoose");
var Review = mongoose.model("Review");

// Get all of the reviews
router.get("/", function (req, res, next) {
	Review.find({})
	.then(function (reviews) {
		res.json(reviews);
	})
	.then(null,next);
})

// Add a review to the db
router.post("/", function (req, res, next){
	Review.create(req.body)
	.then(function (review) {
		return Review.findById(review._id)
		.populate('user')
	})
	.then(function(review) {
		res.json(review);
	})
	.then(null,next);
})

// Add middleware to find review by ID and save in req.review
router.param("reviewId", function (req, res, next, reviewId){
	Review.findById(reviewId)
	.populate('user product')
	.then(function(review){
		req.review = review;
		if (req.user) req.user.hasPermission = req.user.isAdmin || req.user._id.equals(review.user._id);
		if (req.user) console.log("user has hasPermission ", req.user.hasPermission);
		next();
	})
	.then(null,next);
})

// Get a given review by ID
router.get("/:reviewId", function (req, res, next) {
	res.json(req.review);
})

// Update a given review by ID

router.put("/:reviewId", function (req, res, next){
	if (!req.user || !req.user.hasPermission){
		res.status(401).end();
	}
	else {
		req.review.set(req.body);
		req.review.save()
		.then(function(review){
			res.json(review);
		})
		.then(null, next);
	}
})


// Delete a given review by ID
router.delete("/:reviewId", function (req, res, next) {
	if (!req.user || !req.user.hasPermission){
		res.status(401).end();
	}
	else {
		Review.findByIdAndRemove(req.review._id)
		.then(function(review){
			res.json(review);
		})
		.then(null,next);
	}
})

module.exports = router;