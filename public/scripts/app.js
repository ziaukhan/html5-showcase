'use strict';

var sampleApp = angular.module('sampleApp', ['ui.bootstrap', 'ngResource', 'angularTreeview', 'pageslide-directive'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main.html',
        controller: 'MainCtrl'
      })
      .when('/sharing', {
        templateUrl: 'partials/sharing.html',
        controller: 'sharingCtrl'
      })
      .when('/bootstap', {
        templateUrl: 'partials/bootstrap.html'
      })
      .when('/realtime/', {
            templateUrl: 'partials/realtime.html',
            controller: 'RealtimeCtrl'
        })
        .when('/svg/', {
            templateUrl: 'partials/svg.html',
            controller: 'SVGCtrl'
        })
        .when('/3d/', {
            templateUrl: 'partials/3d.html',
            controller: 'chartController'
        })
        .when('/addressbook/', {
            templateUrl: 'partials/addressbook.html',
            controller: 'addressBookCtrl'
        })
        .when('/organizeme/', {
            templateUrl: 'partials/organizeme.html',
            controller: 'organizeMeCtrl'
        })
        .when('/me/', {
            templateUrl: 'partials/me.html'
        })
      .otherwise({
        redirectTo: '/'
      });
  }]);


