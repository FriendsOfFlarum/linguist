const gulp = require('flarum-gulp');

gulp({
    modules: {
        'flagrow/linguist': [
            '../lib/**/*.js',
            'src/**/*.js',
        ],
    },
});
