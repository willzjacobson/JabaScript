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

router.get('/anon/orders/cart', function (req, res, next) {
	// console.log(req.session.cart.items);
	// req.session.cart.items.populate('product')
	// .then(function () {
		res.json(req.session.cart);
	// })
});

// Add middleware to find user by ID and save in req.user
router.param("userId", function (req, res, next, userId){
	User.findById(userId)
	.then(function(user){
		req.requestUser = user;
		if (req.user) req.user.hasPermission = req.user.isAdmin || req.user._id.equals(user._id);
		next();
	})
	.then(null,next);
});

// Get a given user by ID
router.get("/:userId", function (req, res, next) {
	res.json(req.requestUser);
});

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
});

router.put('/:userId/reset', function (req, res, next) {
	if (!req.user || !req.user.hasPermission) {
		res.status(401).end();
	} else {
		req.requestUser.resetRequired = true;
		req.requestUser.save()
		.then(function (user) {
			res.status(200).json(user);
		})
		.then(null, next);
	}
});

router.put('/:userId/resetpwd', function (req, res, next) {
	if (!req.user || !req.user.hasPermission) {
		res.status(401).end();
	} else {
		if (!req.user.correctPassword(req.body.oldPassword)) {
			res.status(401)
			// @OC/PT throw?
			return new Error("There was a problem updating your password");
		}
		else {
			req.user.password = req.body.newPassword;
			req.user.resetRequired = false;
			req.user.save()
			.then(function(updatedUser){
		        res.status(201).send({
		            user: _.omit(updatedUser.toJSON(), ['password', 'salt'])
		        });
			})
			.then(null, next);
		}
	}
});

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
	.populate("product")
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
		// @OB/PT try populate('items.product') instead of all this jibberjabber (look into deepPopulate)
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

router.get("/:userId/orders/cart", function (req, res, next){
	var order;
	Order.findOne({user: req.user._id, status: "Created"})
	.populate('items user')
	.then(function (theOrder) {
		order = theOrder
		if (theOrder) return Product.populate(theOrder.items, {path: 'product'});
		else return theOrder;
	})
	.then(function (){
		res.json(order);
	})
	.then(null, next);
});



module.exports = router;
