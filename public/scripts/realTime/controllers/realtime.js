
(function(){

    sampleApp.controller('RealtimeCtrl', function($scope, $modal, $log, $timeout) {
        $scope.myVideoText = "";
        $scope.hisVideoText = "";
        $scope.roomText = "----"

        $scope.alerts = [];//[{ type: 'error', msg: 'Oh snap! Change a few things up and try submitting again.' }];

        $scope.makeAlert=function(alert, timeout){
            $scope.$apply(function () {
                $scope.alerts.push(alert);
                if(timeout !== null){
                    $timeout(function(){
                        $scope.alerts.splice($scope.alerts.indexOf(alert),1);
                    },timeout||3000);
                }
            });
            return alert;
        }

        $scope.removeAlert=function(alert, timeout){
            $scope.$apply(function () {
                var index = $scope.alerts.indexOf(alert);
                if(index != -1){
                    $scope.alerts.splice($scope.alerts.indexOf(alert),1);
                }
            });
            return alert;
        }

        $scope.changeMyVideoText = function(text){
            $scope.$apply(function () {
                $scope.myVideoText = text;
            });
        }

        $scope.changeHisVideoText = function(text){
            $scope.$apply(function () {
                $scope.hisVideoText = text;
            });
        }

        $scope.changeRoomText = function(text){
            $scope.$apply(function () {
                $scope.roomText = text;
            });
        }

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };


        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: function ($scope, $modalInstance) {

                $scope.promptMessage = "Enter Your Room";

                $scope.ok = function (promptAnswer) {
                    $modalInstance.close(promptAnswer);
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            }
        });

        modalInstance.result.then(function (promptAnswer) {
            realTime.streaming.initiateVideo(promptAnswer);
        }, function () {
            $timeout(function(){
                realTime.view.makeAlert({ type: 'error', msg: 'You Cannot Do Any thing, you have\'nt join the room!'}, null);
            },0);
            //canceled pressed
        });

        util.namespace( "realTime.view", {
            makeAlert: $scope.makeAlert,
            removeAlert: $scope.removeAlert,
            changeMyVideoText: $scope.changeMyVideoText,
            changeHisVideoText: $scope.changeHisVideoText,
            changeRoomText: $scope.changeRoomText
        } );

    });

})();

