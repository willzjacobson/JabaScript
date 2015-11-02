var router = require('express').Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");

router.get("/", function (req, res, next) {
	console.log("We are looking for users");
	User.find({})
	.then(function (users) {
		res.json(users);
	})
	.then(null,next);
});

router.post("/", function (req, res, next){
	console.log("We are adding a user");
	User.create(req.body)
	.then(function (user){
		res.json(user);
	})
	.then(null,next);
});


module.exports = router;
