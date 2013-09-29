
(function(){

    sampleApp.controller('RealtimeCtrl', function($scope, $modal, $log) {
        $scope.myVideoError = false;

        $scope.alerts = [
            /*{ type: 'error', msg: 'Oh snap! Change a few things up and try submitting again.' },
            { type: 'success', msg: 'Well done! You successfully read this important alert message.' },
            { type: 'error', msg: 'Oh snap! Change a few things up and try submitting again.' },
            { type: 'success', msg: 'Well done! You successfully read this important alert message.' },
            { type: 'error', msg: 'Oh snap! Change a few things up and try submitting again.' },
            { type: 'success', msg: 'Well done! You successfully read this important alert message.' }*/
        ];

        $scope.closeAlert = function(index) {
            $scope.alerts.splice(index, 1);
        };



        //$scope.open = function () {
        //setTimeout(function(){
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
                //canceled pressed
            });

        //},1200);

    });

})();

