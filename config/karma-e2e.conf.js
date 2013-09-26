module.exports = function(config){
    config.set({


    basePath : '../',

    files : [
        'app/public/scripts/vendor/jquery.js',
        'app/public/scripts/vendor/angular.js',
        'test/lib/angular/angular-scenario.js',
        'test/e2e/**/*.js'
    ],

    autoWatch : false,

    browsers : ['Chrome'],

    frameworks: ['ng-scenario','jasmine'],

    singleRun : true,

    proxies : {
      '/': 'http://localhost:9000/'
    },

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-ng-scenario'    
            ],

    junitReporter : {
      outputFile: 'test_out/e2e.xml',
      suite: 'e2e'
    }

})}





