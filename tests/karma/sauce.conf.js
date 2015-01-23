// Karma configuration
// Generated on Wed Dec 03 2014 12:25:31 GMT-0800 (PST)

var applyDefaultConfig = require('./default.js');

module.exports = function(config) {

    applyDefaultConfig(config);

    var customLaunchers = {
        sl_chrome: {
            base: 'SauceLabs',
            browserName: 'chrome',
            version: '35'
        },

        sl_safari: {
            base: 'SauceLabs',
            browserName: 'safari',
            platform: 'OS X 10.10'
        },

        sl_firefox: {
            base: 'SauceLabs',
            browserName: 'firefox'
        },
        sl_ie_11: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '11'
        },

        sl_ie_10: {
            base: 'SauceLabs',
            browserName: 'internet explorer',
            version: '10'
        },

        // sl_ie_9: {
        //     base: 'SauceLabs',
        //     browserName: 'internet explorer',
        //     version: '9'
        // },

        // sl_ie_8: {
        //     base: 'SauceLabs',
        //     browserName: 'internet explorer',
        //     version: '8'
        // },

        vm_ie_8: {
            base: 'VirtualBoxBrowser',
            config: {
                vm_name: 'IE8 - Win7', // configured name of your Virtualbox VM
                use_gui: true // use VirtualBox GUI mode, by default runs headless
            }
        },

        vm_ie_9: {
            base: 'VirtualBoxBrowser',
            config: {
                vm_name: 'IE9 - Win7' // configured name of your Virtualbox VM
            }
        }
    };

    var launcher = process.env.LAUNCHER;
    if (!customLaunchers.hasOwnProperty(launcher)) {
        console.error("Set env var 'LAUNCHER' to one of the following:");
        for (k in customLaunchers) {
            console.error("- " + k);
        }

        process.exit(1);
    }

    config.set({

        customLaunchers: customLaunchers,

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['dots', 'progress', 'saucelabs'],

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [process.env.LAUNCHER],

        // Try to fix error: "Disconnected (1 times), because no message in 10000 ms."
        browserNoActivityTimeout: 30000,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Be sure to set up the environment:
        // SAUCE_USERNAME=dtjm
        // SAUCE_ACCESS_KEY=
        sauceLabs: {
            testName: 'plaintext.js jasmine tests'
        }
    });
};