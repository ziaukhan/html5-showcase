'use strict';

sampleApp.controller('MainCtrl', function($scope,NavigationService) {
  $scope.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Bootstrap',
     'Bootstrap UI (Bootstrap for AngularJS)',
      'jQuery',
      'D3.js for Scalable Vector Graphics',
      'Three.js for 3D Graphics',
      'Socket.io for real-time communication',
      'PouchDB for caching and offline applications'
  ];

    $scope.awesomeServerThings = [
        'Node.js',
        'MongoDB'
    ];

  $scope.navigate = function (path){
    //$location.path(path);
      NavigationService.navigate(path);
  }
});

sampleApp.controller('Page2Ctrl', function($scope, NavigationService) {
    $scope.mydata = { text: "Page 2"};

    $scope.navigate = function (path){
        //$location.path(path);//http://docs.angularjs.org/guide/dev_guide.services.$location
        NavigationService.navigate(path);
    }
});

sampleApp.controller('AccordionDemoCtrl', function($scope) {
    $scope.oneAtATime = true;

    $scope.groups = [
        {
            title: "Dynamic Group Header - 1",
            content: "Dynamic Group Body - 1"
        },
        {
            title: "Dynamic Group Header - 2",
            content: "Dynamic Group Body - 2"
        }
    ];

    $scope.items = ['Item 1', 'Item 2', 'Item 3'];

    $scope.addItem = function() {
        var newItemNo = $scope.items.length + 1;
        $scope.items.push('Item ' + newItemNo);
    };
});

sampleApp.controller('UserCtrl', function($scope, User, NavigationService) {
    $scope.user = { username: ""};

    $scope.addUser = function(){
        var u = new User({username: $scope.user.username});
        u.$save();
    }

    $scope.navigate = function (path){
        //$location.path(path);//http://docs.angularjs.org/guide/dev_guide.services.$location
        NavigationService.navigate(path);
    }
});



