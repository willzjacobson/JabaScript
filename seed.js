/*

This seed file is only a placeholder. It should be expanded and altered
to fit the development of your application.

It uses the same file the server uses to establish
the database connection:
--- server/db/index.js

The name of the database used is set in your environment files:
--- server/env/*

This seed file has a safety check to see if you already have users
in the database. If you are developing multiple applications with the
fsg scaffolding, keep in mind that fsg always uses the same database
name in the environment files.

*/

var mongoose = require('mongoose');
var Promise = require('bluebird');
var chalk = require('chalk');
var connectToDb = require('./server/db');
var User = Promise.promisifyAll(mongoose.model('User'));
var Product = Promise.promisifyAll(mongoose.model('Product'));
var Item = Promise.promisifyAll(mongoose.model('Item'));
var Review = Promise.promisifyAll(mongoose.model('Review'));
var Order = Promise.promisifyAll(mongoose.model('Order'));

// As we create these in mongo, save them here so can reference each other
var users, products, orders, items, reviews;

var seedUsers = function () {
    var users = [
        {
            email: 'hillary@fsa.com',
            password: 'president',
            isAdmin: true
        },
        {
            email: 'admin@a.com',
            password: '123',
            isAdmin: true
        },
        {
            email: 'obama@gmail.com',
            password: 'potus'
        },
        {
            email: 'biden@gmail.com',
            password: 'votus'
        },
        {
            email: 'sarahpalin@gmail.com',
            password: 'doofus'
        },
        {
            email: 'trump@gmail.com',
            password: 'pompus'
        }
    ];
    return User.createAsync(users);
};

var seedProducts = function () {
    var products = [
        {
            name: 'Blue Lightsaber',
            category: 'Weapon',
            price: 700000,
            description: 'this is awesome but pretty dangerous',
            numRemaining: 7,
            images: ['https://s3.amazonaws.com/jabbascript/bluelightsaber.png', 'https://s3.amazonaws.com/jabbascript/bluelightsaber2.png']
        },
        {
            name: 'Brown Jawa Robe',
            category: 'Wardrobe',
            price: 13,
            description: 'stylish as fuck, stylish as fuckity fuck',
            numRemaining: 10001,
            images: ['https://s3.amazonaws.com/jabbascript/jawarobe.jpg']
        },
        {
            name: 'Death Sticks',
            category: 'Narcotics',
            price: 2,
            description: 'these aren\'t good for you, but they\'re fun',
            numRemaining: 2,
            images: ['https://s3.amazonaws.com/jabbascript/deathsticks.jpeg']
        },
        {
            name: 'Blaster',
            category: 'Weapon',
            price: 999,
            description: 'great for killing little kittens',
            numRemaining: 11,
            images: ['https://s3.amazonaws.com/jabbascript/blaster.jpg']
        },
        {
            name: 'Jedi Robe',
            category: 'Wardrobe',
            price: 25,
            description: 'Look like a boss, like a motherfucking boss',
            numRemaining: 14,
            images: ['https://s3.amazonaws.com/jabbascript/jedirobe.jpg']
        },
        {
            name: 'Other Jedi Robe',
            category: 'Wardrobe',
            price: 30,
            description: 'Also a Jedi Robe, and it is pretty cool looking',
            numRemaining: 0,
            images: ['https://s3.amazonaws.com/jabbascript/jedirobe.jpg']
        }

    ];
    return Product.createAsync(products);
};

var seedReviews = function () {
    var reviews = [
        {
            product: products[0]._id,
            user: users[0]._id,
            content: "Don't know what I'm reviewing but i liked it",
            rating: 5
        },
        {
            product: products[0]._id,
            user: users[0]._id,
            content: "I hated this. it made me incredibly unhappy",
            rating: 1
        },
        {
            product: products[1]._id,
            user: users[0]._id,
            content: "hell yeah this thing. it was realler perfect for me",
            rating: 5
        },
        {
            product: products[2]._id,
            user: users[2]._id,
            content: "I bought this and now i'm writing a review",
            rating: 4
        },
        {
            product: products[3]._id,
            user: users[3]._id,
            content: "this is a 20 or more character review",
            rating: 2
        },
        {
            product: products[4]._id,
            user: users[4]._id,
            content: "Don't know what I'm reviewing but i liked it",
            rating: 5
        },
        {
            product: products[4]._id,
            user: users[2]._id,
            content: "blah BLAH blah BLAH blah BLAH blah BLAH ",
            rating: 5
        }
    ];
    return Review.createAsync(reviews);
};

var seedItems = function () {
    var items = [
        {
            product: products[0]._id,
            quantity: 4,
            priceWhenOrdered: products[0].price
        },
        {
            product: products[1]._id,
            quantity: 3,
            priceWhenOrdered: products[1].price
        },
        {
            product: products[2]._id,
            quantity: 1,
            priceWhenOrdered: products[2].price
        },
        {
            product: products[0]._id,
            quantity: 2,
            priceWhenOrdered: products[0].price
        },
        {
            product: products[1]._id,
            quantity: 1,
            priceWhenOrdered: products[1].price
        },
        {
            product: products[2]._id,
            quantity: 1,
            priceWhenOrdered: products[2].price
        },
        {
            product: products[3]._id,
            quantity: 1,
            priceWhenOrdered: products[3].price
        },
        {
            product: products[0]._id,
            quantity: 2,
            priceWhenOrdered: products[0].price
        }
    ];
    return Item.createAsync(items);
};

var seedOrders = function () {
    var orders = [
        {
            status: 'Completed',
            dateIssued: new Date(),
            user: users[0]._id,
            items: [items[0]._id, items[1]._id, items[2]._id]
        },
        {
            status: 'Processing',
            dateIssued: new Date(),
            user: users[1]._id,
            items: [items[3]._id, items[4]._id]
        },
        {
            status: 'Cancelled',
            dateIssued: new Date(),
            user: users[2]._id,
            items: [items[5]._id]
        },       
        {
            status: 'Created',
            dateIssued: new Date(),
            user: users[2]._id,
            items: [items[2]._id, items[4]._id]
        },
        {
            status: 'Created',
            dateIssued: new Date(),
            user: users[3]._id,
            items: [items[6]._id, items[7]._id]
        }

    ];
    return Order.createAsync(orders);
};

var users, products, orders, items, reviews;

connectToDb.then(function () {
    mongoose.connection.db.dropDatabase()
    .then(function() {
        return User.findAsync({})
    })
    .then(function (users) {
        if (users.length === 0) {
            return seedUsers();
        } else {
            console.log(chalk.magenta('Seems to already be user data, exiting!'));
            process.kill(0);
        }
    })
    .then(function(usersArr) {
        users = usersArr;
        return Product.findAsync({})
    })
    .then(function (products) {
        if (products.length === 0) {
            return seedProducts();
        } else {
            console.log(chalk.magenta('Seems to already be product data, exiting!'));
            process.kill(0);
        }
    })
    .then(function(productsArr) {
        products = productsArr;
        return Review.findAsync({})
    })
    .then(function (reviews) {
        if (reviews.length === 0) {
            return seedReviews();
        } else {
            console.log(chalk.magenta('Seems to already be review data, exiting!'));
            process.kill(0);
        }
    })
    .then(function() {
        return Item.findAsync({})
    })
    .then(function (items) {
        if (items.length === 0) {
            return seedItems();
        } else {
            console.log(chalk.magenta('Seems to already be item data, exiting!'));
            process.kill(0);
        }
    })
    .then(function(itemsArr) {
        items = itemsArr;
        return Order.findAsync({})
    })
    .then(function (orders) {
        if (orders.length === 0) {
            return seedOrders();
        } else {
            console.log(chalk.magenta('Seems to already be order data, exiting!'));
            process.kill(0);
        }
    })
    .then(function () {
        console.log(chalk.green('Seed successful!'));
        process.kill(0);
    })
    .catch(function (err) {
        console.error(err);
        process.kill(1);
    });
});
