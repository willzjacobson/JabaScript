'use strict';
var passport = require('passport');
var _ = require('lodash');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');

module.exports = function (app) {

    // When passport.authenticate('local') is used, this function will receive
    // the email and password to run the actual authentication logic.
    var strategyFn = function (email, password, done) {
        User.findOne({ email: email })
            .then(function (user) {
                // user.correctPassword is a method from the User schema.
                if (!user || !user.correctPassword(password)) {
                    done(null, false);
                } else {
                    // Properly authenticated.
                    done(null, user);
                }
            }, function (err) {
                done(err);
            });
    };

    passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, strategyFn));

    // A POST /login route is created to handle login.
    app.post('/login', function (req, res, next) {
        var theUser;
        var thePrevCart;
        var authCb = function (err, user) {

            if (err) return next(err);

            if (!user) {
                var error = new Error('Invalid login credentials.');
                error.status = 401;
                return next(error);
            }

            // req.logIn will establish our session.
            return new Promise(function(resolve, reject) {
                return req.logIn(user, function (loginErr) {
                    if (loginErr) return reject(loginErr);
                    resolve(user);
                });
            })
            .then(function(user){
                theUser = user;
                return Order.findOne({status: "Created", user: user._id});
            })
            .then(function(prevCart){
                thePrevCart = prevCart;
                if (!prevCart) {
                    if (req.session.cart) return Order.findById(req.session.cart._id)
                    else return;
                } else return;
            })
            .then(function(sessionCart){
                if (sessionCart){
                    sessionCart.set({user: theUser._id})
                    return sessionCart.save();
                } else return;
            })
            .then(function(sessionCart){
                if (sessionCart && thePrevCart){
                    return thePrevCart.remove()
                }
                return;
            })
            .then(function(){
                res.status(200).send({
                    user: _.omit(theUser.toJSON(), ['password', 'salt'])
                });
            })
            .then(null, function(err){
                res.status(401).send(err);
            })
        };

        passport.authenticate('local', authCb)(req, res, next);

    });

};
