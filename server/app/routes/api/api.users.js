var router = require('express').Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");
var Review = mongoose.model("Review");
var Order = mongoose.model("Order");
var Item = mongoose.model("Item");
var Product = mongoose.model("Product");
var _ = require('lodash');
var passport = require('passport');

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
		req.logIn(user, function (loginErr) {
	        if (loginErr) return next(loginErr);
	        // We respond with a response object that has user with _id and email.
	        res.status(201).send({
	            user: _.omit(user.toJSON(), ['password', 'salt'])
	        });
	    });
	})
	.then(null,next);
});

// Add middleware to find user by ID and save in req.user
router.param("userId", function (req, res, next, userId){
	User.findById(userId)
	.then(function(user){
		req.requestUser = user;
		if (req.user) req.user.hasPermission = req.user.isAdmin || req.user._id.equals(user._id);
		if (req.user) console.log("req.user.hasPermission: ",req.user.hasPermission);
		next();
	})
	.then(null,next);
})

// Get a given user by ID
router.get("/:userId", function (req, res, next) {
	res.json(req.requestUser);
})

// Update a given user by ID

router.put("/:userId", function (req, res, next){
	if (!req.user || !req.user.hasPermission) {
		res.status(401).end();
	} else {
		req.requestUser.set(req.body);
		req.requestUser.save()
		.then(function(user){
			res.json(user);
		})
		.then(null, next);
	}
})


// Delete a given user by ID
router.delete("/:userId", function (req, res, next) {
	if (!req.user || !req.user.hasPermission) {
		res.status(401).end();
	} else {
		req.requestUser.remove()
		.then(function (user){
			res.status(200).json(user);
		})
		.then(null,next);
	}
})

// Get all the reviews that a user has made
router.get("/:userId/reviews", function (req, res, next){
	Review.find({user: req.requestUser._id})
	.then(function (reviews) {
		res.json(reviews)
	})
	.then(null, next);
})

//Get's all orders for a given user
router.get("/:userId/orders", function (req, res, next){
	var orders;
	Order.find({user: req.user._id})
	.populate('items user')
	.then(function (theOrders) {
		var itemsArray = [];
		theOrders.forEach(function(order){
			order.items.forEach(function(item) {
				itemsArray.push(item)
			})
		})
		orders = theOrders
		return Product.populate(itemsArray, {path: 'product'})
	})
	.then(function (){
		res.json(orders);
	})
	.then(null, next);
})

module.exports = router;
