
sampleApp.factory('NavigationService', function ($location) {
    return {
        version : '0.0.1',

        navigate : function (path) {
            $location.path(path);
        }
    }
});

sampleApp.factory('User', ['$resource',
    function($resource) {
        return $resource('/user/:username', {username: '@username'});
    }]);




