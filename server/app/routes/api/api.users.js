var router = require('express').Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Review = mongoose.model("Review");
var Order = mongoose.model("Order");

// Get all of the users
router.get("/", function (req, res, next) {
	User.find({})
	.then(function (users) {
		res.json(users);
	})
	.then(null,next);
});

// Add a user to the db
router.post("/", function (req, res, next){
	User.create(req.body)
	.then(function (user){
		res.status(201).json(user);
	})
	.then(null,next);
});

// Add middleware to find user by ID and save in req.user
router.param("userId", function (req, res, next, userId){
	User.findById(userId)
	.then(function(user){
		req.user = user;
		next();
	})
	.then(null,next);
})

// Get a given user by ID
router.get("/:userId", function (req, res, next) {
	res.json(req.user);
})

// Update a given user by ID

router.put("/:userId", function (req, res, next){
	req.user.set(req.body);
	req.user.save()
	.then(function(user){
		res.json(user);
	})
	.then(null, next);
})


// Delete a given user by ID
router.delete("/:userId", function (req, res, next) {
	User.findByIdAndRemove(req.user._id)
	.then(function(user){
		res.json(user);
	})
	.then(null,next);
})

// Get all the reviews that a user has made
router.get("/:userId/reviews", function (req, res, next){
	Review.find({user: req.user._id})
	.then(function (reviews) {
		res.json(reviews)
	})
	.then(null, next);
})

//Get's all orders for a given user
router.get("/:userId/orders", function (req, res, next){
	Order.find({user: req.user._id})
	.populate('items')
	.then(function (orders) {
		res.json(orders)
	})
	.then(null, next);
})

module.exports = router;
