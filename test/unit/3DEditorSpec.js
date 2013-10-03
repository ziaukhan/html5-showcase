/**
 * Created with JetBrains WebStorm.
 * User: khurram
 * Date: 9/24/13
 * Time: 6:47 PM
 * To change this template use File | Settings | File Templates.
 */


function GetChart(service){

   return service.getGroupedBarChart([
        {group:"A", children:[{name:"A1", frequency:"10"}]},
        {group:"B", children:[{name:"B1", frequency:"10"}]}]);


}



describe('3DEditor service', function(){

    var scope;

    beforeEach(module('sampleApp'));

    beforeEach(inject(function($rootScope, $controller){

        scope = $rootScope.$new();

        $controller("chartController", {$scope:scope});

    }))


    it("should give a groupBarChart",inject(function(service3dTools){

       var _chart =  GetChart(service3dTools);

        expect("groupBarChart").toEqual("groupBarChart");

    }));


    it("should start rotating a chart",inject(function(service3dTools){

        scope.setData([
        {group:"A", children:[{name:"A1", frequency:"10"}]},
        {group:"B", children:[{name:"B1", frequency:"10"}]}]);

        var _chart = scope.createGroupedBarChart();
        scope.startAnimation();

        waitsFor(function() {
           return _chart.rotation.y > 0;
        });

        runs(function(){
            scope.animateChart();
            expect(_chart.rotation.y).toBeGreaterThan(0);
        });

    }));

});