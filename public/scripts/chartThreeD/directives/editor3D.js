/**
 * Created with JetBrains WebStorm.
 * User: Zia
 * Date: 9/16/13
 * Time: 4:40 AM
 * To change this template use File | Settings | File Templates.
 */



(function(){


//    sampleApp.directive('ngContentChange', ['$parse', function($parse) {
//        return function(scope, element, attr) {
//
//            var fn = $parse(attr['ngContentChange']);
//            element.bind('keydown', function(event) {
//                scope.$apply(function() {
//                   fn(scope, {$event:event});
//                });
//            });
//        }
//    }]);



    sampleApp.directive('ngFocus', ['$parse', function($parse) {
        return function(scope, element, attr) {

            var fn = $parse(attr['ngFocus']);
            element.bind('focus', function(event) {
                scope.$apply(function() {
                    fn(scope, {$event:event});
                });
            });
        }
    }]);



    sampleApp.directive('ngChangeSlider', ['$parse', function($parse) {
        return function(scope, element, attr) {

            var fn = attr['ngChangeSlider'];
            element.bind('change', function(event) {
                scope.$apply(function() {

                        scope[fn](event);
                });

            });
        }
    }]);

    sampleApp.directive('ngBlur', ['$parse', function($parse) {
        return function(scope, element, attr) {
            var fn = $parse(attr['ngBlur']);
            element.bind('blur', function(event) {
                scope.$apply(function() {
                    fn(scope, {$event:event});
                });
            });
        }
    }]);



    var _GetItems = function(items){

        var _items =[];

        for(var i =0;i<items.length;i++)
        {
            _items.push({
                name:items[i].querySelector("legend").innerText,
                frequency:items[i].querySelector("frequency").innerText
            });

        }

        return _items;
    }


    function extractData(element){

        var _data=[];
        var _groups = element.find("group");

        _groups.each(function(index, value){

            _data.push({group:value.getAttribute("name"), children: _GetItems(value.querySelectorAll("groupItem"))});

        });

         return _data;
    }



    sampleApp.directive('attachPanelBtn', function ($compile ){

      return {
          restrict: 'A',

          link:function(scope, element, attrs){

              scope.$parent.$on("$includeContentLoaded", function(evt){

                  var _targetElement =   attrs.attachPanelBtn;
                  var container =  attrs.container;

                  var _newElement =  angular.element('<a pageslide="right" container="'+container+'" content=".panelHeader, .controlContainer, .panelFooter" ps-speed="0.5" href="#'+_targetElement +'"class="btn">Edit</a>');
                  element.append(_newElement);
                  $compile(_newElement)(scope);

              })




          }


      }



    });


        sampleApp.directive('threeD', function ( /* dependencies */ ) {
        // define constants and helpers used for the directive
        // ...
        return {
            restrict: 'E', // the directive can be invoked only by using <my-directive> tag in the template

            scope:false,

            transclude:true,

            template:
                    '<canvas style="" ng-click="onPointerDown()"></canvas>' +
                    '<div class="data-container" ng-transclude style="display:none"></div>',

            link: function (scope, element, attrs, controller) {

                //setup 3d environment
               scope.init();

               scope.setData( [
                   {group:"A", children:[{name:"A1", frequency:"10"}]},
                   {group:"B", children:[{name:"A1", frequency:"10"}]}]);


                scope.drawGroupedBarChart();


            }
        };
    });


})();