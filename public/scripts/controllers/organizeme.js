/**
 * Created with JetBrains WebStorm.
 * User: Zia
 * Date: 9/20/13
 * Time: 3:44 AM
 * To change this template use File | Settings | File Templates.
 */

sampleApp.controller('organizeMeCtrl', function($scope, topicsdb) {
    $scope.topicName = '';
    $scope.topicTree = [];
    topicsdb.getAll().then(function(res){
        if(res.total_rows == 0){
            var dateId1 = new Date();
            var dateId2 = new Date(dateId1.getTime()+1);
            var dateId3 = new Date(dateId2.getTime()+1);

            $scope.$apply(function(){
                $scope.topicTree = [
                    {
                        "topicName" : "SVG",
                        "dataContainer": true,
                        "_id" : dateId1.toISOString(),
                        "parentId": "0",
                        "children" : [
                                { "topicName" : "D3.js",
                                    "dataContainer": true,
                                    "_id" : new Date(dateId2.getTime()+3).toISOString(),
                                    "parentId": dateId1.toISOString(),
                                    "children" : [] }
                                         ] },
                    {
                        "topicName" : "WebGL",
                        "dataContainer": true,
                        "_id" : dateId2.toISOString(),
                        "parentId": "0",
                        "children" : [
                                { "topicName" : "Three.js",
                                    "dataContainer": true,
                                    "_id" : new Date(dateId2.getTime()+6).toISOString(),
                                    "parentId": dateId2.toISOString(),
                                    "children" : [] }
                    ] },
                    {
                        "topicName" : "Web Socket",
                        "dataContainer": true,
                        "_id" : dateId3.toISOString(),
                        "parentId": "0",
                        "children" : [] }
                ];
                topicsdb.saveList({docs: $scope.topicTree}).then(function(){

                });
            });
        } else {
            $scope.$apply(function(){
                res.rows.forEach(function(value, index){
                    $scope.topicTree.push(value.doc);
                });
            });
        }
    });


    $scope.showContainer = false;
    $scope.noteTitle = "";
    $scope.note = "";
    $scope.isDisabled = false;

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
            var newTopic = { "topicName" : $scope.topicName, "dataContainer": true, "_id" : new Date().toISOString(), "parentId": $scope.topicTree.currentNode.parentId, "children" : [] };
            $scope.topicTree.currentNode.children.push(newTopic);
            topicsdb.add(newTopic);
        }
        else {
            var newMainTopic = { "topicName" : $scope.topicName, "_id" : new Date().toISOString(), "parentId": 0, "dataContainer": true,  "children" : [] };
            $scope.topicTree.push(newMainTopic ) ;
            topicsdb.add(newMainTopic);
        }
        $scope.topicName = '';
    }


    $scope.addNote = function(){
        $scope.topicTree.currentNode.children.push( { "topicName" : $scope.noteTitle, "note": $scope.note, "_id" : new Date().toISOString(), "parentId": $scope.topicTree.currentNode.parentId, "dataContainer": false,  "children" : [] }) ;
        $scope.noteTitle = '';
        $scope.note = '';
    }

    $scope.updateNote = function(){

    }

    $scope.deleteNote = function(){

    }








});
