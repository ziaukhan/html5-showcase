( function () {

    "use strict";

    /*$scope.toolPanelOpened = false;
    $scope.toolSelected = false;
    $scope.selectedToolName = "Rectangle";

    $scope.creationBtnClicked = function(){

        if($scope.toolSelected) {
            $scope.toolSelected = false;
            $scope.toolPanelOpened = false;
            //setCreationTool = null
        } else{
            $scope.toolPanelOpened = !$scope.toolPanelOpened;
        }
    }

    $scope.mainMenuItems = svgEditor.mainMenu.items;*/


    sampleApp.controller( 'SVGCtrl', function ( $scope, $timeout ) {
        //move this code to directive

        /*$scope.mainMenuItemClicked = function(item, scope){
            console.log(item);
        }*/

    } );

    //move this to a central location
    sampleApp.run( function () {
        signalsSVG.init();
    } )

} )();
