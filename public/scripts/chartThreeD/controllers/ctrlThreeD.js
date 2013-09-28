/**
 * Created with JetBrains WebStorm.
 * User: Zia
 * Date: 9/14/13
 * Time: 8:53 AM
 * To change this template use File | Settings | File Templates.
 */

var renderer;
var scene;
var camera;
var editorControls;




function setScreenCamera( container ) {

    var newFov = Math.atan2( 1366, window.outerWidth ) * 180 / Math.PI; // 45 at 1366
    // Create a camera and add it to the scene
    camera = new THREE.PerspectiveCamera( newFov, container.offsetWidth / container.offsetHeight, 1, 10000 );

    camera.position.set( 1000.00, 500.00, 1000.00 );
    //camera.position.set( 0, 400, 700 );
    //camera.position.set( 1000.00, 0, 0 );
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

    scene.add( camera );

    return camera;
}


function create3dCanvas() {

  //  d3.selectAll( "#canvas *" ).remove();
    var container = document.getElementById( "canvas" );

    renderer = new THREE.WebGLRenderer( { antialias: true, canvas:container.querySelector("canvas") } );
   renderer.setSize( container.offsetWidth, container.offsetHeight );

    renderer.domElement.style['background-color'] = "white";

   // container.appendChild( renderer.domElement );

    // Create a new Three.js scene
    scene = new THREE.Scene();


    //createAdonerHelpers();


    camera = setScreenCamera( container );

    headLight = new THREE.PointLight( 0xFFFFFF, 0.7 );
    scene.add( headLight );
    headLight.position = camera.position;

    editorControls = new THREE.EditorControls( camera, container, renderer.domElement );
    editorControls.enabled = true;
    editorControls.dispatchEvent = function(){

        renderer.render(scene, camera);
    }
//    transformControls = new THREE.TransformControls( camera, renderer.domElement, container, new THREE.EventDispatcher );
//    transformControls.addEventListener( 'change', function () {
//
//       signals3d.objectChanged.dispatch( pNext3d.viewPort.getSelectedObject() );
//       signals3d.sceneChanged.dispatch();
//    } );

//    scene.add( transformControls.gizmo );
//    transformControls.hide();

    renderer.render( scene, camera );

//    set3dCanvasHandlers();
}





 var _chart;
var animationStarted=false;


function doAnimation(){



}



sampleApp.controller('slideController', function($scope, service3dTools) {


    $scope.renderScene=function(evt){


        if(evt.target.classList.contains("scalerX")){

            $scope.$parent.chart.scale.x = evt.target.value;

        }else if(evt.target.classList.contains("scalerY")){

            $scope.$parent.chart.scale.y = evt.target.value;

        }else if(evt.target.classList.contains("scalerZ")) {

            $scope.$parent.chart.scale.z = evt.target.value;
        }

            $scope.$parent.sceneChanged();
        }

    $scope.$watch('$parent.getChart()', function(newVal, oldVal){
            $scope.chart  = newVal;
    });




});



sampleApp.controller('editChartController', function($scope, service3dTools) {

    $scope.errorFree = function(){
        return (d3.selectAll(".controlContainer .contentError")[0].length < 1);
    }



    $scope.drawChart=function(){

        $scope.handleValidation();

        if($scope.errorFree()) {

            $scope.$parent.drawGroupedBarChart();
            //scope.togglePanel();

        }else{
            console.log("Oops!")
        }

    }

   $scope.unFocusFrequency=function($event){

        if($event.target.value.length == 0 || isNaN($event.target.value)){
            $($event.target).closest(".nodeChild").addClass("contentError");
        }

    }


    $scope.focusItem =  $scope.focusFrequency = function($event){

        $($event.target).closest(".nodeChild").removeClass("contentError");

    }


    $scope.handleValidation = function(){

        //$(".error").parent().style("background-color","darkred");

        d3.selectAll(".controlContainer .itemFrequency").attr("value", function(){

            if(this.value.length ==0 || isNaN(this.value)){

                $(this).closest(".nodeChild").addClass("contentError");
               // this.parentNode.parentNode.classList.add("error");
               // $(this).closest(".nodeChild").addClass("contentError");
            }else{
                return this.value;
            }

        });

        d3.selectAll(".controlContainer .groupName, .controlContainer .itemName").attr("value", function(){
            if(this.value.length==0){

                if(this.parentNode.nodeName=="SPAN") {
                   $(this).closest(".nodeChild").addClass("contentError");
                }else  {
                    this.parentNode.classList.add("contentError");
                }
            } else {  return this.value; }
        })


    }




    $scope.unFocusItem =function($event, index){

        if($event.target.value.length == 0){
            $($event.target).closest(".nodeChild").addClass("contentError");
        }

        $scope.$parent.groups.forEach(function(item){
            item.children[index].name =  $event.target.value;
        })



        //$event.target.parentNode.classList.remove("itemNameError");

    }

    $scope.focusGroup=function($event)  {

        $event.target.parentNode.classList.remove("contentError");
        $($event.target).closest(".groupContainer").addClass("groupHightLighted");

    }


    $scope.unFocusGroup=function($event)  {

        $($event.target).closest(".groupContainer").removeClass("groupHightLighted");

        if($event.target.value.length ==0){
            $event.target.parentNode.classList.add("contentError");
        }else{
            $event.target.parentNode.classList.remove("contentError");
        }




    }





});


sampleApp.controller('specController', function($scope) {


    $scope.tell = function(){

        return "telling";
    }

});


    sampleApp.controller('chartController', function($scope, service3dTools) {


    $scope.doAnimation = function(){

        if(animationStarted){

            $scope.chart.rotation.y += .005;
            $scope.sceneChanged();

            requestAnimationFrame($scope.doAnimation);
        }


    }



    $scope.setData=function(data){

        $scope.groups =data;

    }


    $scope.addItem=function(group, groupIndex){

        $scope.groups.forEach(function(group){
            group.children.push({legend:"", frequency:""});
        })

    }

    $scope.removeItem = function(index){

        //var _index = $scope.groups[0].children

        $scope.groups.forEach(function(group){
                 group.children.splice(index,1);
        })

    }

    $scope.removeGroup=function(group){
        $scope.groups.splice($scope.groups.indexOf(group), 1);
    }

    $scope.addGroup=function(){

        $scope.groups.push({group:"", children:[]});

       var _groupLength = $scope.groups.length;

         if(_groupLength>0){

             $scope.groups[0].children.forEach(function(child){
                 $scope.groups[_groupLength-1].children.push({
                     name:child.name,
                     frequency:""});
             });

         }

    }


    $scope.sceneChanged = function(){

       if(renderer)
            renderer.render(scene, camera);

    }

    $scope.animateChart = function(){

          if(animationStarted == false){
              animationStarted = true;
              $scope.doAnimation();
          }
          else{
              animationStarted = false;
          }




    }



    $scope.startAnimation= function(){

        animationStarted = true;
        $scope.doAnimation();

    }

     $scope.chart = null;

    $scope.getChart = function(){

        return $scope.chart;

    }

    $scope.createGroupedBarChart = function(){
        $scope.chart = service3dTools.getGroupedBarChart( $scope.groups);
        return $scope.chart;
    }

    $scope.getScene = function(){
        return scene;
    }

    $scope.drawElement = function(element){
        scene.add($scope.chart);
    }




       $scope.drawGroupedBarChart = function(){

           var _chart =  $scope.createGroupedBarChart();

           var _oldChart = $scope.getScene().getObjectByName("groupBarChart");

           if(_oldChart){
               _chart.scale.copy(_oldChart.scale);
               _chart.position.copy(_oldChart.position);
               _chart.rotation.copy(_oldChart.rotation);

               _oldChart.parent.remove(_oldChart);
           }

           $scope.drawElement(_chart);
           $scope.sceneChanged();



       }


//    $scope.drawGroupedBarChart = function(){
//
//        $scope.chart = service3dTools.getGroupedBarChart( $scope.groups);
//
//        var _oldChart = scene.getObjectByName("groupBarChart");
//
//        if(_oldChart){
//             $scope.chart.scale.copy(_oldChart.scale);
//            _oldChart.parent.remove(_oldChart);
//        }
//
//       scene.add($scope.chart);
//       renderer.render(scene, camera);
//
//        return  $scope.chart;
//    }




    $scope.init= function(){

        create3dCanvas();

    }


   $scope.onPointerDown=function(){

   }

});
