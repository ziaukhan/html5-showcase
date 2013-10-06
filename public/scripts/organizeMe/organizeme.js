/**
 * Created with JetBrains WebStorm.
 * User: Zia
 * Date: 9/20/13
 * Time: 3:44 AM
 * To change this template use File | Settings | File Templates.
 */

sampleApp.controller('confirmDeleteCtrl', function ($scope, $modalInstance, item) {

    $scope.selected = item;

    $scope.delete = function () {
        $modalInstance.close($scope.selected.item);
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

});



sampleApp.controller('organizeMeCtrl', function($scope, topicsdb, $modal) {

    $scope.topicName = '';
    $scope.topicTree = [{
        collapsed:true,
        isRoot:true,
        "topicName" : "Root",
        "dataContainer": true,
        "_id" :(function(){ _id =util.generateElementID(); return _id}()),
        "parentId":0,
        "isParent":true,
        parent:"true",
        "children" : [] }];

    $scope.topicTree.stackEmpty=true;


    topicsdb.getAll().then(function(res){
        if(res.total_rows == 0){

            var _id;

            console.log("Dummy data added");

            $scope.$apply(function(){
                $scope.topicTree[0].children.push(
                    {
                    collapsed:true,
                        "topicName" : "SVG",
                        "dataContainer": true,
                        "_id" :(function(){ _id =util.generateElementID(); return _id}()),
                        "parentId":0,
                        "isParent":true,
                        parent:"true",
                        "children" : [
                        {
                            "parentId":_id,
                            "_id" :(function(){ _id = util.generateElementID(); return _id}()),
                            "topicName" : "D3.js",
                            "dataContainer": true,
                            "children" : [] }
                    ] }

                );





                //  debugger;

                topicsdb.saveList( $scope.topicTree[0].children,function(success){

                    //success handling
                    console.log("Dummy data saved");

                   for(var i=0;i<success.length;i++){

                        if($scope.topicTree[0].children[i]._id  == success[i].id ){

                            console.log("Object ID matched");
                            $scope.topicTree[0].children[i]._rev = success[i].rev;
                        }

                    }

                    //debugger;


                },function(err){

                    console.log("error")
                    //error handling

                });

                //  $scope.objectize();
                //$scope.topicTree.push($scope.addTopicControl);

            });

            $scope.objectize();


        } else {
            //reading data from local storage

            console.log("saved data loaded");

            $scope.$apply(function(){

                res.rows.forEach(function(value, index){


                    var _removeSelection  = function(list){

                        for(var i=0;i<list.length;i++){

                            if(list[i].selected == "selected"){
                                list[i].selected = undefined;
                            }

                            if(list[i].children.length>0){
                                _removeSelection(list[i].children);
                            }


                        }


                    }

                    if(value.doc.selected == "selected"){
                        value.doc.selected = undefined;
                    }

                    if(value.doc.children.length>0){
                        _removeSelection(value.doc.children);
                    }


                    $scope.topicTree[0].children.push(value.doc);
                });



                //$scope.topicTree.push($scope.addTopicControl);

            });
        }

        $scope.objectize();

    });

//    $scope.showContainer = false;
//    $scope.noteTitle = "New Note";
//    $scope.note = "";
//    $scope.isDisabled = false;
//
   $scope.observer = {};

    $scope.initApp = function(){

     //$scope.topicTree.currentNode = $scope.topicTree[0];

     $("#splashPage_organizeMe").delay(1000).fadeOut("slow");
     $("#explorerPanel").delay(1000).show("slow")

    }
//
//
    $scope.removeStack=function(event){

        if(event.target.nodeName != "SPAN" && event.target.nodeName != "I"){


            if( $scope.topicTree.currentNode){

            }
              else{
                console.log("oops!, some error occurred!");
            }

            $scope.topicTree.currentNode.selected = undefined;

            $scope.topicTree.stackEmpty=true;

        }

//        event.stopImmediatePropagation();
//        event.stopPropagation();
//        event.preventDefault();

    }

//    $scope.removeSelection = function(list){
//
//
//        var _removeSelection = function(list){
//
//            for(var i in list){
//                if(list[i].children.length > 0){
//                    $scope.removeSelection(list[i].children);
//                }else{
//                    if(list[i].selected == "selected"){
//                        list[i].selected = undefined;
//                    }
//                }
//            }
//        }
//
//        if(!Array.isArray(list)){
//
//            if(list.selected == "selected"){
//
//                _removeSelection(list.children);
//            }
//
//        }else
//        {
//            _removeSelection(list);
//
//        }
//
//    }
//
//
//    $scope.menuItem ={name:"test"};
//
//
//    $scope.getModel = function(node, success, failure){
//
//        var _modalInstance = $modal.open(
//            {
//
//                templateUrl: "scripts/organizeMe/Templates/confirmDelete_organizeMe.html",
//                controller:'confirmDeleteCtrl',
//                resolve:{
//                    item:function(){
//                        return node;
//                    }
//                }
//            });
//        _modalInstance.result.then(function(item){
//
//            success(item);
//            //$scope.deleteNote(index);
//
//        }, function(){
//
//            failure();
//
//            //console.log("modal cancelled");
//
//        });
//
//
//    }
//
//
    $scope.objectize = function(){

       // $scope.objectDB ={};
        //$scope.topicTree = [root];

        for(var i= 0; i< $scope.topicTree[0].children.length;i++){

            $scope.observer[$scope.topicTree[0].children[i]._id] = $scope.$watch( "topicTree[0].children["+i+"]",function(newVal, oldVal){

                if(newVal){


                    topicsdb.saveObject(newVal).then(function(res){
                          newVal._rev = res.rev;
                           console.log("object updated successfully");
                       }, function(err){

                           console.log("object not updated");
                       });

                }
           }, true);
       }
    }

    $scope.handleDelete = function(index, event){

        var _node =  $scope.topicTree.currentNode.children[index];

        if(!_node){

            _node =  $scope.topicTree.currentNode;

                if(_node.isParent){

                    alert("It is parent");

                  topicsdb.removeObject($scope.topicTree.currentNode).then(
                        function(success){

                            console.log("object removed successfully");

                           var _res =  $scope.observer[success.id];

                           // $scope.topicTree.currentNode.deleted = "true";

                           $scope.$apply(function() {
                                $scope.topicTree[0].children.splice($scope.topicTree[0].children.indexOf($scope.topicTree.currentNode), 1);
                               });
                       },
                       function(failure){
                            console.log("object could not be removed");
                       })


                }else{

                    if(!_node.isRoot){

                    var _parentNode = $scope.getParent($scope.topicTree[0].children, _node.parentId);

                    if(_parentNode) {

                        console.log("Parent found while searcing ")

                       // $scope.$apply(function(){
                            _parentNode.children.splice(_parentNode.children.indexOf(_node),1);
                       // });

                        }
                  }

                }
         }else
            {
                       var _item =  $(event.target.parentNode).next().css({"position":"relative", transform:"rotate(18deg)"});

                        _item.animate({
                            "opacity":"0",
                            "top": ($(".itemsContainer_organizeMe")[0].getBoundingClientRect().bottom - _item[0].getBoundingClientRect().top - _item[0].getBoundingClientRect().height) +"px"

                        }, function(){


                                $(event.target.parentNode).remove();

                                $scope.deleteNote(index);
                                $scope.$apply();





                        });



                   // }

                }

    }
//
//
//
//
//
//    $scope.$watch( 'topicTree.currentNode', function( newObj, oldObj ) {
//        if( $scope.topicTree && angular.isObject($scope.topicTree.currentNode)) {
//            console.log( 'Node Selected!!' );
//            console.log( $scope.topicTree.currentNode );
//
//            if($scope.topicTree.currentNode.dataContainer){
//                $scope.showContainer = true;
//                $scope.isDisabled = false;
//                $scope.noteTitle = '';
//                $scope.note =  '';
//            }
//            else {
//                $scope.isDisabled = true;
//                $scope.noteTitle = $scope.topicTree.currentNode.topicName;
//                $scope.note =  $scope.topicTree.currentNode.note;
//            }
//        }else{
//          //$scope.topicTree.currentNode = undefined;
//         //$scope.addTopic();
//
//        }
//
//    }, false);
//

    $scope.getParent = function(data, id) {

            for (var i = 0; i < data.length; i++) {

                if (data[i]._id == id) {
                    return data[i];
                } else if (data[i].children.length > 0) {
                    return $scope.getParent(data[i].children, id);
                }
            }

        }
//
//
//
    $scope.addTopic  = function(explicit, event) {

        console.log("Add Topic");

     //   if($scope.topicTree && $scope.topicTree.currentNode.dataContainer){

                    if(!explicit){

                        if( $scope.topicTree && angular.isObject($scope.topicTree.currentNode)) {
                            console.log( 'Node Selected!!' );
                            console.log( $scope.topicTree.currentNode );

                            //var newTopic = { "topicName" : $scope.topicName, "dataContainer": true, "_id" : new Date().toISOString(), "parentId": $scope.topicTree.currentNode.parentId, "children" : [] };
                            var newTopic = { "topicName" : "New Topic ", "dataContainer": true, "_id" : new Date().toISOString(), "parentId": $scope.topicTree.currentNode._id, "children" : [] };


                            $scope.topicTree.currentNode.children.push(newTopic);

//
//                            $scope.$watch(newTopic,function(newVal, old){
//
//                                topicsdb.saveObject(newVal).then(function(res){
//                                    console.log("new object updated");
//                                }, function(err){
//                                });
//                            });
//
//
//                            topicsdb.saveObject(newTopic).then(function(res){
//                                console.log("new object saved");
//                            }, function(err){
//                            })




                        }
                    }
                    else {

                        var newMainTopic = {
                            isParent:true,
                            "topicName": "New Topic ",
                            "_id" : new Date().toISOString(),
                            "parentId": 0,
                            "dataContainer": true,
                            "children" : []
                        };

                       $scope.topicTree[0].children.push(newMainTopic);

                       $scope.$watch(newMainTopic,function(newVal, old){

                           topicsdb.saveObject(newVal).then(function(res){
                               console.log("new object updated");
                           }, function(err){
                           });
                       });


                      topicsdb.saveObject(newMainTopic).then(function(res){

                           console.log("new object saved");

                      }, function(err){
                      });


                    }

    //}


        event.stopPropagation();
        event.stopImmediatePropagation();


        $scope.topicName = '';
    }

    $scope.addNote = function(){

      //  $scope.topicTree.currentNode.children.push( { "topicName" : $scope.noteTitle, "note": $scope.note, "_id" : new Date().toISOString(), "parentId": $scope.topicTree.currentNode.parentId, "dataContainer": false,  "children" : [] }) ;
          $scope.topicTree.currentNode.children.push( { "topicName" :"New Note", "note": $scope.note, "_id" : new Date().toISOString(), "parentId": $scope.topicTree.currentNode._id, "dataContainer": false,  "children" : [] }) ;


        $scope.noteTitle = '';
        $scope.note = '';
    }

    $scope.updateNote = function(topicName, note){

        if(topicName){
            $scope.topicTree.currentNode.topicName = topicName;
    }

        if(note){
            $scope.topicTree.currentNode.note = note;
        }


    }

    $scope.deleteNote = function(index){

         $scope.topicTree.currentNode.children.splice(index,1);

    }


    $scope.onTopicNameChange= function(evt, item){

        item.topicName = evt.target.innerText;
        //$scope.updateNote(evt.target.innerText,null);

    }

    $scope.onTopicContentChange= function(evt){
        $scope.updateNote(null, evt.target.innerHTML);
    }





});
