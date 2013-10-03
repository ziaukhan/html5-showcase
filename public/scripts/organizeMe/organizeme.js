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
    $scope.topicTree = [];
    topicsdb.getAll().then(function(res){
        if(res.total_rows == 0){

            var _id;

//            var dateId1 = new Date();
//            var dateId2 = new Date(dateId1.getTime()+1);
//            var dateId3 = new Date(dateId2.getTime()+1);

            $scope.$apply(function(){
                $scope.topicTree  = [
                    {
                        "topicName" : "SVG",
                        "dataContainer": true,
                        "_id" :(function(){ _id =util.generateElementID(); return _id}()),
                        "parentId":0,
                         parent:"true",
                        "children" : [
                            {
                                "parentId":_id,
                                "_id" :(function(){ _id = util.generateElementID(); return _id}()),
                                "topicName" : "D3.js",
                                "dataContainer": true,
                                "children" : [] }
                        ] },
                    {
                        "topicName" : "CSS",
                        "dataContainer": true,
                        "_id" :(function(){ _id =util.generateElementID(); return _id}()),
                        "parentId":0,
                        parent:"true",
                        "children" : [
                            {
                                "parentId":_id,
                                "_id" :(function(){ _id = util.generateElementID(); return _id}()),
                                "topicName" : "Animations",
                                "dataContainer": true,
                                "children" : [] }
                        ] }


                ];


                $scope.objectize();

                topicsdb.saveList( $scope.topicTree,function(success){

                   //success handling

                },function(err){

                  //error handling

                });
            });
        } else {



            var _rawList = [];

      $scope.$apply(function(){
        res.rows.forEach(function(value, index){


            var _removeSelection  = function(list){

                for(var i=0;i<list.length;i++){
                    if(list[i].children.length>0){
                         _removeSelection(list[i].children);
                    }
                    else{
                        if(list[i].selected == "selected"){
                            list[i].selected = undefined;
                        }
                    }

                }


            }

            if(value.doc.selected == "selected"){
                value.doc.selected = undefined;
            }

            if(value.doc.children.length>0){
                _removeSelection(value.doc.children);
            }


            $scope.topicTree.push(value.doc);
        });
            });

//       $scope.removeSelection(_rawList);
//
//        $scope.$apply(function(){
//            $scope.topicTree = _rawList;
//        });



            $scope.objectize();

        }
    });


    $scope.showContainer = false;
    $scope.noteTitle = "New Note";
    $scope.note = "";
    $scope.isDisabled = false;

    $scope.initApp = function(){

     $("#splashPage_organizeMe").delay(500).fadeOut("slow");
     $("#explorerPanel").delay(500).show("slow")

    }

    $scope.removeSelection = function(list){

       for(var i in list){

           if(list[i].children.length > 0){
               $scope.removeSelection(list[i].children);
           }else{

               if(list[i].selected == "selected"){
                    list[i].selected = undefined;
               }

           }


       }

    }

    $scope.objectize = function(){

       // $scope.objectDB ={};

        for(var i in $scope.topicTree){
           $scope.$watch( "topicTree["+i+"]",function(newVal, oldVal){
                   topicsdb.saveObject(newVal).then(function(res){
                       newVal._rev = res.rev;
                       console.log("object updated successfully");
                   }, function(err){

                       console.log("object not updated");
                   })
           }, true);
       }

    }

    $scope.handleDelete = function(index, event){

        var _node =  $scope.topicTree.currentNode.children[index];


        if(_node.children.length>0){

            var _modalInstance = $modal.open(
                {

                    templateUrl: "scripts/organizeMe/Templates/confirmDelete_organizeMe.html",

                    controller:'confirmDeleteCtrl',

                    resolve:{
                        item:function(){
                            return _node;
                        }
                    }
                });

            _modalInstance.result.then(function(item){

                $scope.deleteNote(index);

            }, function(){

                //console.log("modal cancelled");

            })


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



        }

    }


    $scope.showNote=function(){

        alert(9);
    }


    $scope.$watch( 'topicTree.currentNode', function( newObj, oldObj ) {
        if( $scope.topicTree && angular.isObject($scope.topicTree.currentNode) ) {
            console.log( 'Node Selected!!' );
            console.log( $scope.topicTree.currentNode );

            if($scope.topicTree.currentNode.dataContainer){
                $scope.showContainer = true;
                $scope.isDisabled = false;
                $scope.noteTitle = '';
                $scope.note =  '';
            }
            else {
                $scope.isDisabled = true;
                $scope.noteTitle = $scope.topicTree.currentNode.topicName;
                $scope.note =  $scope.topicTree.currentNode.note;
            }
        }
    }, false);

    $scope.addTopic = function() {
        console.log("Add Topic");
        if( $scope.topicTree && angular.isObject($scope.topicTree.currentNode) ) {
            console.log( 'Node Selected!!' );
            console.log( $scope.topicTree.currentNode );

            //var newTopic = { "topicName" : $scope.topicName, "dataContainer": true, "_id" : new Date().toISOString(), "parentId": $scope.topicTree.currentNode.parentId, "children" : [] };
            var newTopic = { "topicName" : "New Topic ", "dataContainer": true, "_id" : new Date().toISOString(), "parentId": $scope.topicTree.currentNode.parentId, "children" : [] };


            $scope.topicTree.currentNode.children.push(newTopic);
           // topicsdb.add(newTopic);
        }
        else {
            var newMainTopic = { "topicName": "New Topic ", "_id" : new Date().toISOString(), "parentId": 0, "dataContainer": true,  "children" : [] };
            $scope.topicTree.push(newMainTopic ) ;
            //topicsdb.add(newMainTopic);
        }
        $scope.topicName = '';
    }

    $scope.addNote = function(){

      //  $scope.topicTree.currentNode.children.push( { "topicName" : $scope.noteTitle, "note": $scope.note, "_id" : new Date().toISOString(), "parentId": $scope.topicTree.currentNode.parentId, "dataContainer": false,  "children" : [] }) ;
          $scope.topicTree.currentNode.children.push( { "topicName" :"New Note", "note": $scope.note, "_id" : new Date().toISOString(), "parentId": $scope.topicTree.currentNode.parentId, "dataContainer": false,  "children" : [] }) ;


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


    $scope.onTopicNameChange= function(evt){
        $scope.updateNote(evt.target.innerText,null);
    }

    $scope.onTopicContentChange= function(evt){
        $scope.updateNote(null, evt.target.innerHTML);
    }





});
