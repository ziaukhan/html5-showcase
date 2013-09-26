/**
 * Created with JetBrains WebStorm.
 * User: khurram
 * Date: 9/24/13
 * Time: 6:47 PM
 * To change this template use File | Settings | File Templates.
 */




describe('3DEditor service', function(){

    beforeEach(module('sampleApp'));

    it("should give a groupedBarChart",inject(function(service3dTools){

       var _chart = service3dTools.getGroupedBarChart([
           {group:"A", children:[{name:"A1", frequency:"10"}]},
           {group:"B", children:[{name:"B1", frequency:"10"}]}]);

       expect(_chart.name).toBe("groupBarChart");

    }));




});