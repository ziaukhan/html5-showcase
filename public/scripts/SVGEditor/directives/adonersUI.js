sampleApp.directive( 'adonered', function ( /* dependencies */ ) {

    return {
        restrict: 'A', // the directive can be invoked only by using <my-directive> tag in the template
        scope: { // attributes bound to the scope of the directive
            //val: '='
        },
        link: function ( scope, element, attrs ) {
            // initialization, done once per my-directive tag in template. If my-directive is within an
            // ng-repeat-ed template then it will be called every time ngRepeat creates a new copy of the template.
            console.log( scope );
            console.log( element );
            console.log( attrs );



            // whenever the bound 'exp' expression changes, execute this
            //scope.$watch('exp', function (newVal, oldVal) {
            // ...
            //});
        }
    };
} );