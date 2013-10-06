/**
 * Created with JetBrains WebStorm.
 * User: khurram
 * Date: 10/4/13
 * Time: 11:30 AM
 * To change this template use File | Settings | File Templates.
 */


sampleApp.directive("setBackground", function(){

    return {

        restrict:"A",

        link:function(scope, ele, attr){


          //  scope.$eval(attr.setBackground).children.forEach(function(child){

                if(scope.$eval(attr.setBackground).dataContainer==false) {
                    ele.css("backgroundImage","url(/img/stickyNote.png)");
                } else{
                    ele.css("backgroundImage","url(/img/stickyNoteContainer_organizeMe.png)");
                    // ele.style.backgroundImage = "background-image: url(/img/stickyNoteContainer_organizeMe.png);";
                }

           // });




        }

    };



});