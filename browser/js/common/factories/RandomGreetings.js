app.factory('RandomGreetings', function () {

    var getRandomFromArray = function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var greetings = [
        'May the force be with you!',
        'I have a bad feeling about this!',
        'Never tell me the odds.',
        'The odds of surviving an asteroid field are 438923722 to 1!',
        'Eager to buy things, you are.',
        'Mind tricks don\'t work on me. Only money.',
        'Help me, User Wan Kenobi. You\'re my only hope!',
        'Behold the power of this fully operational website.',
        'Only a Sith deals in absolutes. We deal in fine, quality items.',
        'Ewoks get 10% off!'
    ];

    return {
        greetings: greetings,
        getRandomGreeting: function () {
            return getRandomFromArray(greetings);
        }
    };

});
