module.exports = function(config){
    config.set({
    basePath : '../',

    files : [
        '../app/public/scripts/vendor/jquery.js',
      '../app/public/scripts/vendor/angular.js',
      '../app/public/scripts/vendor/three.js',
        '../app/public/scripts/vendor/fonts3D/*.js',
      '../app/public/scripts/vendor/angular-*.js',
        '../app/public/scripts/vendor/angular.treeview.js',
        '../app/public/scripts/vendor/pouchdb-nightly.js',
      '../app/public/scripts/vendor/ui-bootstrap.js',
        '../app/public/scripts/vendor/q.min.js',
        '../app/public/scripts/snippets/utils.js',
        '../app/test/lib/angular/angular-mocks.js',
      '../app/public/scripts/app.js',
      '../app/public/scripts/controllers/*.js',
      '../app/public/scripts/directives/*.js',
      '../app/public/scripts/services/*.js',
      '../app/public/scripts/chartThreeD/services/*.js',
      '../app/public/scripts/chartThreeD/controllers/ctrlThreeD.js',
       // 'app/public/scripts/filters/*.js',
      '../app/test/unit/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-junit-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'       
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

})}
