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

        $timeout( function () {
            svgEditor.menu.showMain( svgEditor.constants.menuRadius + 5, svgEditor.constants.menuRadius + 5 );

            try{
                if(createEventObject){
                    console.log("yes")
                    var event = new createEventObject('mouseup', { 'detail': "to Expand Menu for First time" });
                    svgEditor.d3menuG.select(".radialMenuCenterSpot").node().dispatchEvent(event);
                }
            } catch(e){
                if(Event){
                    var event = document.createEvent('HTMLEvents');    // create event
                    event.initEvent('mouseup', true, true );     // name event
                    event.data = { 'detail': "to Expand Menu for First time" };
                    svgEditor.d3menuG.select(".radialMenuCenterSpot").node().dispatchEvent(event);
                }
            }
        } );
        /*$scope.mainMenuItemClicked = function(item, scope){
            console.log(item);
        }*/

    } );

    sampleApp.run( function () {
        signalsSVG.init();
    } )

} )();
