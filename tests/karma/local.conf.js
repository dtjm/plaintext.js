// Karma configuration
// Generated on Wed Dec 03 2014 12:25:31 GMT-0800 (PST)

var applyDefaultConfig = require('./default.js');

module.exports = function(config) {

    applyDefaultConfig(config);
    
    config.set({
        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};